const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  deepgramApiKey: process.env.DEEPGRAM_API_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
  database: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost'
  },
  cors: {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    maxHttpBufferSize: 1e8
  }
};