import React, { useState } from 'react';
import './App.css';
import { ResumeForm, JobForm, BothForm } from './components/Forms';

type AnalysisType = 'resume-only' | 'job-only' | 'both' | null;

function App() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>(null);
  const [results, setResults] = useState(null);

  const handleResumeSubmit = async (resumeData: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/analysis/resume-only', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleJobSubmit = async (jobData: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/analysis/job-only', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleBothSubmit = async (bothData: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/analysis/both', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bothData)
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Resume Scanner</h1>
        <p>AI-powered resume analysis and job matching</p>
      </header>
      
      <main className="main-content">
        {!analysisType && (
          <div className="analysis-selector">
            <h2> What would you like to analyze? </h2>
            <div className="option-cards">
              <button 
                className="option-card"
                onClick={() => setAnalysisType('resume-only')}
              >
                <h3> Resume Only </h3>
                <p>Get insights and job recommendations</p>
              </button>
              
              <button 
                className="option-card"
                onClick={() => setAnalysisType('job-only')}
              >
                <h3>Job Description</h3>
                <p>Optimize your resume for this role</p>
              </button>
              
              <button 
                className="option-card"
                onClick={() => setAnalysisType('both')}
              >
                <h3> Compare Both </h3>
                <p>See how well you match</p>
              </button>
            </div>
          </div>
        )}
        
        {analysisType && !results && (
          <div className="input-section">
            {analysisType === 'resume-only' && (<ResumeForm onSubmit={handleResumeSubmit} />)}
            {analysisType === 'job-only' && (<JobForm onSubmit={handleJobSubmit} />)}
            {analysisType === 'both' && (<BothForm onSubmit={handleBothSubmit} />)}
            <button onClick={() => setAnalysisType(null)}>← Back</button>
          </div>
        )}
        
        {results && (
          <div className="results-section">
            {/* add later */}
            <button onClick={() => { setResults(null); setAnalysisType(null); }}>
              Start Over
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;