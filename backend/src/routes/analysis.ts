import express from 'express';
import { AnalysisEngine } from '../services/analysisEngine';
import { CerebrasService } from '../services/cerebrasService';
import { USAJobsService } from '../services/usaJobsService';
import { Resume, JobDescription } from '../types';

const router = express.Router();

