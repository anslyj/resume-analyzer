import React, { useState } from 'react';
import './App.css';
import { ResumeForm, JobForm, BothForm } from './components/Forms';
import { Results } from './components/Results';


type AnalysisType = 'resume-only' | 'job-only' | 'both' | null;

function App() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>(null);
  const [results, setResults] = useState<any>(null);

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
 
const mockResults = {
  type: 'resume-only' as const,
  summary: "Your resume shows strong technical skills in software development with 5+ years of experience. You have excellent problem-solving abilities and leadership experience. However, there are opportunities to better highlight your achievements with quantifiable metrics and expand your cloud computing skills.",
  strengths: [
    "Strong technical background in React, Node.js, and Python",
    "Leadership experience managing a team of 4 developers",
    "Excellent problem-solving and analytical skills",
    "Good communication and collaboration abilities",
    "Experience with agile development methodologies"
  ],
  improvements: [
    "Add more quantifiable achievements (e.g., 'Increased performance by 40%')",
    "Include cloud computing certifications (AWS, Azure)",
    "Highlight specific project outcomes and business impact",
    "Add more industry-relevant keywords for ATS optimization",
    "Include links to portfolio or GitHub projects"
  ],
  skillAssessments: [
    {
      skill: "JavaScript/React",
      level: "Advanced" as const,
      score: 85,
      feedback: "Strong foundation with modern React patterns. Consider learning Next.js for full-stack development."
    },
    {
      skill: "Backend Development",
      level: "Intermediate" as const,
      score: 70,
      feedback: "Good Node.js experience. Expand into microservices and database optimization."
    },
    {
      skill: "Cloud Computing",
      level: "Beginner" as const,
      score: 40,
      feedback: "Limited cloud experience. AWS or Azure certification would significantly boost your profile."
    },
    {
      skill: "Project Management",
      level: "Intermediate" as const,
      score: 75,
      feedback: "Good leadership skills shown. Consider PMP or Scrum Master certification."
    }
  ],
  jobRecommendations: [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      matchScore: 88,
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      reasons: [
        "Strong React and JavaScript skills match requirements",
        "Leadership experience aligns with senior role expectations",
        "Company culture emphasizes collaboration and innovation"
      ]
    },
    {
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      matchScore: 75,
      location: "Remote",
      salary: "$100k - $130k",
      reasons: [
        "Both frontend and backend experience required",
        "Startup environment matches your adaptability",
        "Growth opportunities in emerging tech stack"
      ]
    },
    {
      title: "Technical Lead",
      company: "Enterprise Solutions",
      matchScore: 82,
      location: "New York, NY",
      salary: "$140k - $170k",
      reasons: [
        "Leadership experience directly applicable",
        "Technical skills meet minimum requirements",
        "Opportunity to mentor junior developers"
      ]
    }
  ],
  actionableRecommendations: [
    "Add a 'Key Achievements' section with quantified results (e.g., 'Reduced load time by 60%', 'Led team that delivered project 2 weeks early')",
    "Get AWS Cloud Practitioner certification to demonstrate cloud knowledge",
    "Create a portfolio website showcasing your best projects with live demos",
    "Optimize your resume with industry keywords: 'microservices', 'CI/CD', 'agile', 'scalable architecture'",
    "Add links to your GitHub profile and highlight your most impressive repositories",
    "Consider contributing to open source projects to demonstrate collaboration skills",
    "Update your LinkedIn profile to match your resume and engage with tech community posts"
  ]
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
          <Results 
            results={results} 
            onStartOver={() => { setResults(null); setAnalysisType(null); }}
          />
        )}
      </main>
    </div>
  );
}

export default App;