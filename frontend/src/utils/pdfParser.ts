// Alternative approach: Use PDF.js with proper worker setup
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Dynamic import to avoid build issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source to CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = 
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    console.error('Error details:', error);
    throw new Error('Failed to extract text from PDF. Please try copying and pasting the text instead.');
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