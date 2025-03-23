import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

interface TranscriptionData {
  is_final: boolean;
  speech_final: boolean;
  channel?: {
    alternatives: Array<{
      transcript: string;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | null = null;
  private transcriptionSubject = new Subject<TranscriptionData>();

  connect() {
    this.socket = io(environment.wsUrl, {
      withCredentials: true,
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('transcription', (data: TranscriptionData) => {
      this.transcriptionSubject.next(data);
    });

    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  onTranscription(): Observable<TranscriptionData> {
    return this.transcriptionSubject.asObservable();
  }

  startTranscription(): void {
    this.socket?.emit('startTranscription');
  }

  stopTranscription(): void {
    this.socket?.emit('stopTranscription');
  }

  sendAudio(audioData: ArrayBuffer): void {
    this.socket?.emit('sendAudio', audioData);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
} 