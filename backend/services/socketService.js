const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');
const config = require('../config');

const deepgram = createClient(config.deepgramApiKey);

class SocketService {
  setupSocket(socket) {
    console.log('Client connected');
    let dgConnection;

    socket.on('startTranscription', () => {
      try {
        dgConnection = this.createDeepgramConnection(socket);
      } catch (error) {
        console.error('Error creating Deepgram connection:', error);
        socket.emit('error', error.message);
      }
    });

    socket.on('sendAudio', (audioData) => {
      try {
        if (dgConnection) {
          dgConnection.send(audioData);
        }
      } catch (error) {
        console.error('Error sending audio to Deepgram:', error);
        socket.emit('error', error.message);
      }
    });

    socket.on('stopTranscription', () => {
      if (dgConnection) {
        dgConnection.finish();
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      if (dgConnection) {
        dgConnection.finish();
      }
    });
  }

  createDeepgramConnection(socket) {
    const dgConnection = deepgram.listen.live({
      model: 'nova-3',
      language: 'en',
      smart_format: true,
      interim_results: true,
      encoding: 'linear16',
      sample_rate: 48000,
      channels: 1,
    });

    dgConnection.on(LiveTranscriptionEvents.Open, () => {
      console.log('Deepgram connection opened');
      socket.emit('dgReady');
    });

    dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
      const transcript = data.channel?.alternatives[0]?.transcript;
      if (transcript && transcript.trim()) {
        console.log('Transcript:', transcript);
        socket.emit('transcription', data);
      }
    });

    dgConnection.on(LiveTranscriptionEvents.Error, (error) => {
      console.error('Deepgram error:', error);
      socket.emit('error', error.message);
    });

    dgConnection.on(LiveTranscriptionEvents.Close, () => {
      console.log('Deepgram connection closed');
    });

    return dgConnection;
  }
}

module.exports = new SocketService();