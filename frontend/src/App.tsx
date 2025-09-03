import React, { useState } from 'react';
import './App.css';

type AnalysisType = 'resume-only' | 'job-only' | 'both' | null;

function App() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>(null);
  const [results, setResults] = useState(null);

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
            {/* add later */}
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