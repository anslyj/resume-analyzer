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
    });
  }
});

// Test USAJobs connection
router.get('/test-usajobs', async (req, res) => {
  try {
    const categories = await USAJobsService.getJobCategories();
    
    if (categories.length > 0) {
      res.json({ 
        status: 'success', 
        message: 'USAJobs API is working correctly!',
        jobCategories: categories.slice(0, 10), // Show first 10 categories
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'USAJobs API test failed',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'USAJobs API test failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Analyze resume only
router.post('/resume-only', async (req, res) => {
  try {
    const { content, fileName } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Resume content is required' });
    }

    const resume: Resume = {
      content,
      fileName: fileName || 'resume.txt',
      uploadDate: new Date(),
    };

    const result = await AnalysisEngine.analyzeResumeOnly(resume);
    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});
