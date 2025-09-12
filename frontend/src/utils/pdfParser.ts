// PDF.js with Create React App compatible setup
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    // Use env-based API base URL so production builds hit the deployed backend
    const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API}/api/pdf/extract-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process PDF');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(error instanceof Error 
      ? error.message 
      : 'Failed to extract text from PDF. Please try again.');
  }
};

export const validatePDFFile = (file: File): string | null => {
  // Check file type
  if (file.type !== 'application/pdf') {
    return 'Please select a PDF file only.';
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return 'File size must be less than 5MB.';
  }
  
  return null; // No errors
};