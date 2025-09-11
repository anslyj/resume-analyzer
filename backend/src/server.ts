import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analysisRoutes from './routes/analysis';
import pdfRoutes from './routes/pdf';

dotenv.config();

// Debug environment variables
console.log('=== Environment Variables Debug ===');
console.log('ADZUNA_APP_ID:', process.env.ADZUNA_APP_ID ? 'SET' : 'NOT SET');
console.log('ADZUNA_APP_KEY:', process.env.ADZUNA_APP_KEY ? 'SET' : 'NOT SET');
console.log('Current working directory:', process.cwd());

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Resume Analyzer Server is running',
    apis: ['Cerebras AI', 'Adzuna Jobs'],
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Resume Analyzer Server running on port ${PORT}`);
  console.log(`📊 Using Adzuna API for government job data`);
  console.log(`🤖 Using Cerebras AI for analysis`);
});