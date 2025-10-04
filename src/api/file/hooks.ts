// File API React Hooks

import { useState } from 'react';
import { FileApiClient } from './client';
import { FileUploadRequest, FileUploadResponse } from './types';

// Hook for file upload
export function useFileUpload(client: FileApiClient) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<FileUploadResponse | null>(null);

  const uploadFile = async (request: FileUploadRequest) => {
    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await client.uploadFile(request);
      setUploadResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setError(null);
    setUploadResult(null);
    setIsUploading(false);
  };

  return {
    uploadFile,
    isUploading,
    error,
    uploadResult,
    reset,
  };
}