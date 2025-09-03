import React, { useState } from 'react';

interface ResumeFormProps {
  onSubmit: (data: any) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content, fileName: fileName || 'resume.txt' });
  };

  return (
    <form onSubmit={handleSubmit} className="analysis-form">
      <h2>📄 Resume Analysis</h2>
      
      <div className="form-group">
        <label>File Name (optional)</label>
        <input 
          type="text" 
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="my-resume.pdf"
        />
      </div>
      
      <div className="form-group">
        <label>Resume Content *</label>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={15}
          required
        />
      </div>
      
      <button type="submit" disabled={!content.trim()}>
        Analyze Resume
      </button>
    </form>
  );
};

interface JobFormProps {
  onSubmit: (data: any) => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, company, content });
  };

  return (
    <form onSubmit={handleSubmit} className="analysis-form">
      <h2> Job Description Analysis </h2>
      
      <div className="form-group">
        <label>Job Title</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Software Engineer"
        />
      </div>
      
      <div className="form-group">
        <label>Company</label>
        <input 
          type="text" 
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Tech Corp"
        />
      </div>
      
      <div className="form-group">
        <label>Job Description *</label>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste the job description here..."
          rows={15}
          required
        />
      </div>
      
      <button type="submit" disabled={!content.trim()}>
        Analyze Job
      </button>
    </form>
  );
};

