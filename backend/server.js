const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin : '*',
    // origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://192.168.1.5:5173", "http://192.168.*.*:5173"],
    methods: ["GET", "POST"],
    // credentials: true,
    maxHttpBufferSize: 1e8 // 100 MB max buffer size
  }
});


// Initialize Deepgram
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

io.on('connection', (socket) => {
  console.log('Client connected');
  
  let dgConnection;

  socket.on('startTranscription', () => {
    console.log('startTranscription');
    try {
      // Create Deepgram live transcription connection
      dgConnection = deepgram.listen.live({
        model: 'nova-3',
        language: 'en-US',
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
          // console.log('data',data)
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
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 