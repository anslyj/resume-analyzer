import express from 'express';
import { AnalysisEngine } from '../services/analysisEngine';
import { CerebrasService } from '../services/cerebrasService';
import { USAJobsService } from '../services/usaJobsService';
import { Resume, JobDescription } from '../types';

const router = express.Router();

router.get('/test-cerebras', async(req,res) => {
  try {
    const isWorking = await CerebrasService.testConnection();

    if(isWorking) {
      res.json({
        status: 'success',
        message: 'Cerebras API is working correctly!',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Cerebras API test failed',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error', 
      message: 'Cerebras API test failed',
      timestamp: new Date().toISOString()
    })
  }
})