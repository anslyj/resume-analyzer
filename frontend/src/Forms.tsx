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

