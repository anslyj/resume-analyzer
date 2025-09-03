declare module 'pdf-parse' {
  interface PDFMetadata {
    info?: Record<string, any>;
    metadata?: any;
  }

  interface PDFData {
    numpages: number;
    numrender: number;
    info: PDFMetadata['info'];
    metadata: PDFMetadata['metadata'];
    version: string;
    text: string;
  }

  function pdf(data: Buffer | Uint8Array | ArrayBuffer, options?: any): Promise<PDFData>;
  export = pdf;
}
