import React, { useState } from 'react';
import { extractTextFromPDF, validatePDFFile } from '../utils/pdfParser';
interface ResumeFormProps {
  onSubmit: (data: any) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'text' | 'file'>('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [roleLevel, setRoleLevel] = useState('Any Level');


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setIsProcessing(true);

    try {
      // Validate file
      const validationError = validatePDFFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file);
      setContent(extractedText);
      setFileName(file.name);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content, fileName: fileName || 'resume.txt', roleLevel });
  };

  return (
    <form onSubmit={handleSubmit} className="analysis-form">
      <h2>📄 Resume Analysis</h2>
      
      {/* Upload Method Selector */}
      <div className="form-group">
        <label>How would you like to provide your resume?</label>
        <div className="upload-method-selector">
          <button
            type="button"
            className={`method-btn ${uploadMethod === 'file' ? 'active' : ''}`}
            onClick={() => setUploadMethod('file')}
          >
             Upload PDF
          </button>
          <button
            type="button"
            className={`method-btn ${uploadMethod === 'text' ? 'active' : ''}`}
            onClick={() => setUploadMethod('text')}
          >
             Copy & Paste
          </button>
        </div>
      </div>

      {uploadMethod === 'file' && (
        <div className="form-group">
          <label>Upload Resume PDF</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="file-input"
          />
          {isProcessing && (
            <div className="processing-indicator">
               Processing PDF... Please wait
            </div>
          )}
          {error && (
            <div className="error-message">
               {error}
            </div>
          )}
        </div>
      )}


      {uploadMethod === 'text' && (
        <div className="form-group">
          <label>File Name (optional)</label>
          <input 
            type="text" 
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="my-resume.pdf"
          />
        </div>
      )}

      <div className="form-group">
        <label>Job Level Preference</label>
        <select 
          value={roleLevel}
          onChange={(e) => setRoleLevel(e.target.value)}
          className="role-select"
        >
          <option value="Any Level">Any Level</option>
          <option value="Intern">Intern</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Junior">Junior</option>
          <option value="Mid Level">Mid Level</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
          <option value="Manager">Manager</option>
          <option value="Director">Director</option>
        </select>
      </div>

      
      <div className="form-group">
        <label>Resume Content *</label>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={uploadMethod === 'file' 
            ? "Upload a PDF file above and the content will appear here..." 
            : "Paste your resume text here..."
          }
          rows={15}
          required
          readOnly={uploadMethod === 'file' && isProcessing}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={!content.trim() || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Analyze Resume'}
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

interface BothFormProps {
  onSubmit: (data: any) => void;
}

export const BothForm: React.FC<BothFormProps> = ({ onSubmit }) => {
  const [resumeContent, setResumeContent] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeUploadMethod, setResumeUploadMethod] = useState<'text' | 'file'>('text');
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobContent, setJobContent] = useState('');

  const handleResumeFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeError('');
    setIsProcessingResume(true);

    try {
      const validationError = validatePDFFile(file);
      if (validationError) {
        setResumeError(validationError);
        return;
      }

      const extractedText = await extractTextFromPDF(file);
      setResumeContent(extractedText);
      setResumeFileName(file.name);
      
    } catch (error) {
      setResumeError(error instanceof Error ? error.message : 'Failed to process PDF');
    } finally {
      setIsProcessingResume(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      resume: {
        content: resumeContent,
        fileName: resumeFileName || 'resume.txt'
      },
      jobDescription: {
        title: jobTitle,
        company: jobCompany,
        content: jobContent
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="analysis-form">
      <h2> Compare Resume vs Job</h2>
      
      <div className="form-section">
        <h3>Resume</h3>
        
        {/* Upload Method Selector for Resume */}
        <div className="form-group">
          <label>How would you like to provide your resume?</label>
          <div className="upload-method-selector">
            <button
              type="button"
              className={`method-btn ${resumeUploadMethod === 'file' ? 'active' : ''}`}
              onClick={() => setResumeUploadMethod('file')}
            >
               Upload PDF
            </button>
            <button
              type="button"
              className={`method-btn ${resumeUploadMethod === 'text' ? 'active' : ''}`}
              onClick={() => setResumeUploadMethod('text')}
            >
               Copy & Paste
            </button>
          </div>
        </div>

        {resumeUploadMethod === 'file' && (
          <div className="form-group">
            <label>Upload Resume PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeFileUpload}
              disabled={isProcessingResume}
              className="file-input"
            />
            {isProcessingResume && (
              <div className="processing-indicator">
                Processing PDF... Please wait
              </div>
            )}
            {resumeError && (
              <div className="error-message">
                ❌ {resumeError}
              </div>
            )}
          </div>
        )}

        {resumeUploadMethod === 'text' && (
          <div className="form-group">
            <label>File Name (optional)</label>
            <input 
              type="text" 
              value={resumeFileName}
              onChange={(e) => setResumeFileName(e.target.value)}
              placeholder="my-resume.pdf"
            />
          </div>
        )}
        
        <div className="form-group">
          <label>Resume Content *</label>
          <textarea 
            value={resumeContent}
            onChange={(e) => setResumeContent(e.target.value)}
            placeholder={resumeUploadMethod === 'file' 
              ? "Upload a PDF file above and the content will appear here..." 
              : "Paste your resume text here..."
            }
            rows={8}
            required
            readOnly={resumeUploadMethod === 'file' && isProcessingResume}
          />
        </div>
      </div>
      
      {/* Job Description section remains the same */}
      <div className="form-section">
        <h3>Job Description</h3>
        <div className="form-group">
          <label>Job Title</label>
          <input 
            type="text" 
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Software Engineer"
          />
        </div>
        <div className="form-group">
          <label>Company</label>
          <input 
            type="text" 
            value={jobCompany}
            onChange={(e) => setJobCompany(e.target.value)}
            placeholder="Tech Corp"
          />
        </div>
        <div className="form-group">
          <label>Job Description *</label>
          <textarea 
            value={jobContent}
            onChange={(e) => setJobContent(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            required
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!resumeContent.trim() || !jobContent.trim() || isProcessingResume}
      >
        {isProcessingResume ? 'Processing Resume...' : 'Compare Both'}
      </button>
    </form>
  );
};