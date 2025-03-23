import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../../services/websocket.service';

interface AudioProcessorMessage {
  data: Float32Array;
}

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interview-container" *ngIf="interviewId">
      <div class="ai-section">
        <h3>AI Interviewer</h3>
        <div class="ai-questions">
          {{ currentQuestion() }}
        </div>
      </div>
      
      <div class="video-section">
        <h3>Interview</h3>
        <video #videoElement autoplay playsinline></video>
        <div class="controls">
          <button (click)="toggleRecording()">
            {{ isRecording() ? 'Stop Recording' : 'Start Recording' }}
          </button>
        </div>
      </div>
      
      <div class="transcription-section">
        <h3>Live Transcription</h3>
        <div class="transcript">
          @for(line of transcriptLines(); track $index) {
            <p>{{ line }}</p>
          }
        </div>
      </div>
    </div>
    <div class="error-container" *ngIf="!interviewId">
      <h2>Invalid Interview Session</h2>
      <p>This interview session does not exist or has expired.</p>
      <button (click)="goToDashboard()">Return to Dashboard</button>
    </div>
  `,
  styles: [`
    .interview-container {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      gap: 20px;
      height: 100vh;
      padding: 20px;
    }

    .ai-section, .video-section, .transcription-section {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 15px;
    }

    video {
      width: 100%;
      border-radius: 8px;
      background: #000;
    }

    .controls {
      margin-top: 15px;
      text-align: center;
    }

    .transcript {
      height: calc(100vh - 100px);
      overflow-y: auto;
      padding: 10px;
      background: white;
      border-radius: 4px;
    }

    button {
      padding: 10px 20px;
      border-radius: 20px;
      border: none;
      background: #4CAF50;
      color: white;
      cursor: pointer;
    }

    button:hover {
      background: #45a049;
    }

    .error-container {
      text-align: center;
      padding: 2rem;
      max-width: 600px;
      margin: 2rem auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      h2 {
        color: #f44336;
        margin-bottom: 1rem;
      }

      button {
        margin-top: 1rem;
        background: #2196F3;
        
        &:hover {
          background: #1976D2;
        }
      }
    }
  `]
})
export class InterviewComponent implements OnInit {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: AudioWorkletNode | null = null;
  
  interviewId = signal<string | null>(null);
  currentQuestion = signal<string>('Tell me about yourself...');
  isRecording = signal<boolean>(false);
  transcriptLines = signal<string[]>([]);

  constructor(
    private wsService: WebSocketService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (this.isValidInterviewId(id)) {
        this.interviewId.set(id);
        this.setupWebSocket();
      } else {
        this.interviewId.set(null);
      }
    });
  }

  private isValidInterviewId(id: string): boolean {
    return Boolean(id && id.length > 2);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  private setupWebSocket() {
    this.wsService.connect();
    
    this.wsService.onTranscription().subscribe(data => {
      if (data.is_final && data.speech_final) {
        const text = data.channel?.alternatives[0]?.transcript;
        if (text?.trim()) {
          this.transcriptLines.update(lines => [...lines, text]);
        }
      }
    });
  }

  async toggleRecording() {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true
        },
        video: true
      });

      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.srcObject = this.stream;
      }

      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);

      await this.audioContext.audioWorklet.addModule(
        URL.createObjectURL(new Blob([`
          class AudioProcessor extends AudioWorkletProcessor {
            process(inputs, outputs) {
              const input = inputs[0][0];
              if (input) {
                this.port.postMessage(input);
              }
              return true;
            }
          }
          registerProcessor('audio-processor', AudioProcessor);
        `], { type: 'text/javascript' }))
      );

      this.processor = new AudioWorkletNode(this.audioContext, 'audio-processor');
      this.processor.port.onmessage = (e: AudioProcessorMessage) => {
        const audioData = e.data;
        const pcmData = Int16Array.from(audioData.map((n: number) => n * 0x7FFF));
        this.wsService.sendAudio(pcmData.buffer);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.wsService.startTranscription();
      this.isRecording.set(true);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  private stopRecording() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.wsService.stopTranscription();
    this.isRecording.set(false);
  }

  ngOnDestroy() {
    this.stopRecording();
    this.wsService.disconnect();
  }
} 