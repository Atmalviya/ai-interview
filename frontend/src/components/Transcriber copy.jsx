import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Transcriber.css';

const Transcriber = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Connection error: ' + error.message);
    });

    socketRef.current.on('transcription', (data) => {
      console.log('Received transcription data:', data);
      const text = data.channel?.alternatives[0]?.transcript;
      if (text && text.trim()) {
        console.log('Adding transcript:', text);
        setTranscript(prev => {
          // If it's a final transcript, add it with a new line
          if (data.is_final) {
            return prev + text + '\n';
          }
          // For interim results, update the last line
          const lines = prev.split('\n');
          if (lines.length > 1) {
            return lines.slice(0, -1).join('\n') + '\n' + text;
          }
          return text;
        });
      }
    });

    socketRef.current.on('error', (errorMessage) => {
      console.error('Transcription error:', errorMessage);
      setError('Transcription error: ' + errorMessage);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      await audioContextRef.current.audioWorklet.addModule(
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

      processorRef.current = new AudioWorkletNode(audioContextRef.current, 'audio-processor');
      processorRef.current.port.onmessage = (e) => {
        const audioData = e.data;
        // Convert Float32Array to Int16Array
        const pcmData = Int16Array.from(audioData.map(n => n * 0x7FFF));
        socketRef.current.emit('sendAudio', pcmData.buffer);
      };

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      socketRef.current.emit('startTranscription');
      setIsRecording(true);
      setError('');
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Error starting recording: ' + error.message);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      socketRef.current.emit('stopTranscription');
      setIsRecording(false);
    }
  };

  return (
    <div className="transcriber">
      <h1>Live Transcription</h1>
      {error && <div className="error">{error}</div>}
      <div className="controls">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? 'stop' : 'start'}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {isRecording && <div className="recording-indicator">Recording...</div>}
      </div>
      <div className="transcript-container">
        <h2>Transcript:</h2>
        <div className="transcript">
          {transcript.split('\n').map((line, i) => (
            <p key={i}>{line || 'Transcript will appear here...'}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transcriber; 