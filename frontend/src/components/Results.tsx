import React from 'react';

interface SkillAssessment {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  score: number;
  feedback: string;
}

interface JobRecommendation {
  title: string;
  company: string;
  matchScore: number;
  location: string;
  salary?: string;
  reasons: string[];
}

interface AnalysisResults {
  type: 'resume-only' | 'job-only' | 'both';
  summary: string;
  strengths: string[];
  improvements: string[];
  skillAssessments?: SkillAssessment[];
  jobRecommendations?: JobRecommendation[];
  matchScore?: number;
  actionableRecommendations: string[];
}

interface ResultsProps {
  results: AnalysisResults;
  onStartOver: () => void;
}

export const Results: React.FC<ResultsProps> = ({ results, onStartOver }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return '#27ae60';
      case 'Advanced': return '#2ecc71';
      case 'Intermediate': return '#f39c12';
      case 'Beginner': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2> Analysis Results</h2>
        <button onClick={onStartOver} className="start-over-btn">
          ← Start Over
        </button>
      </div>

      {/* AI Analysis Summary */}
      <div className="analysis-section">
        <h3> AI Analysis Insights</h3>
        <div className="summary-card">
          <p>{results.summary}</p>
        </div>
      </div>

      {/* Match Score (for job comparison) */}
      {results.matchScore !== undefined && (
        <div className="analysis-section">
          <h3> Match Score</h3>
          <div className="match-score-card">
            <div className="score-circle">
              <div 
                className="score-fill" 
                style={{ 
                  background: `conic-gradient(${getScoreColor(results.matchScore)} ${results.matchScore * 3.6}deg, #e9ecef 0deg)`
                }}
              >
                <span className="score-text">{results.matchScore}%</span>
              </div>
            </div>
            <div className="score-description">
              <p>Overall compatibility between your resume and the job requirements</p>
            </div>
          </div>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div className="analysis-section">
        <div className="strengths-improvements">
          <div className="strengths-card">
            <h3> Strengths</h3>
            <ul>
            {(results.strengths || []).map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="improvements-card">
            <h3>🔧 Areas for Improvement</h3>
            <ul>
            {(results.improvements || []).map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Skill Assessments */}
      {results.skillAssessments && results.skillAssessments.length > 0 && (
        <div className="analysis-section">
          <h3>🛠️ Skill Assessment</h3>
          <div className="skills-grid">
          {(results.skillAssessments || []).map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  <h4>{skill.skill}</h4>
                  <span 
                    className="skill-level"
                    style={{ backgroundColor: getSkillLevelColor(skill.level) }}
                  >
                    {skill.level}
                  </span>
                </div>
                <div className="skill-score">
                  <div className="score-bar">
                    <div 
                      className="score-fill-bar"
                      style={{ 
                        width: `${skill.score}%`,
                        backgroundColor: getScoreColor(skill.score)
                      }}
                    />
                  </div>
                  <span className="score-number">{skill.score}%</span>
                </div>
                <p className="skill-feedback">{skill.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Recommendations */}
      {results.jobRecommendations && results.jobRecommendations.length > 0 && (
        <div className="analysis-section">
          <h3> Job Recommendations</h3>
          <div className="jobs-grid">
          {(results.jobRecommendations || []).map((job, index) => (
              <div key={index} className="job-card">
                <div className="job-header">
                  <h4>{job.title}</h4>
                  <div className="match-badge" style={{ backgroundColor: getScoreColor(job.matchScore) }}>
                    {job.matchScore}% match
                  </div>
                </div>
                <div className="job-details">
                  <p className="company"> {job.company}</p>
                  <p className="location"> {job.location}</p>
                  {job.salary && <p className="salary"> {job.salary}</p>}
                </div>
                <div className="job-reasons">
                  <h5>Why this matches:</h5>
                  <ul>
                  {(job.reasons || []).map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Recommendations */}
      <div className="analysis-section">
        <h3> Actionable Recommendations</h3>
        <div className="recommendations-list">
        {(results.actionableRecommendations || []).map((recommendation, index) => (
            <div key={index} className="recommendation-item">
              <div className="recommendation-number">{index + 1}</div>
              <p>{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
