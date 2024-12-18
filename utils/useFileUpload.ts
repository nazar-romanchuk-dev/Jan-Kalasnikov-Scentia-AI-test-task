import { useState } from 'react';

export const useFileUpload = (
  maxSizeMB = 50,
  allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/html',
  ]
) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const selectedFile = files[0];

      const maxFileSize = maxSizeMB * 1024 * 1024;

      if (selectedFile.size > maxFileSize) {
        setError(`File size exceeds ${maxSizeMB} MB.`);
        setFile(null);

        return;
      }

      if (!allowedTypes.includes(selectedFile.type)) {
        setError(
          'Invalid file type. Please upload a PDF, DOCX, PPTX, TXT, or HTML file.'
        );

        setFile(null);

        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleRemoveUploadedItem = () => {
    setFile(null);
  };

  return { file, error, handleFileChange, setFile, handleRemoveUploadedItem };
};
