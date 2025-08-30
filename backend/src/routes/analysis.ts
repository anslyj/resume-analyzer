import express from 'express';
import { AnalysisEngine } from '../services/analysisEngine';
import { CerebrasService } from '../services/cerebrasService';
import { AdzunaService } from '../services/adzunaService';
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
    const categories = await AdzunaService.getJobCategories();
    
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

// Analyze job description only
router.post('/job-only', async (req, res) => {
  try {
    const { title, company, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Job description content is required' });
    }

    const jobDescription: JobDescription = {
      title: title || 'Unknown Position',
      company: company || 'Unknown Company',
      content,
    };

    const result = await AnalysisEngine.analyzeJobOnly(jobDescription);
    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

// Analyze both
router.post('/both', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    
    if (!resume?.content || !jobDescription?.content) {
      return res.status(400).json({ 
        error: 'Both resume and job description content are required' 
      });
    }

    const result = await AnalysisEngine.analyzeBoth(resume, jobDescription);
    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;

