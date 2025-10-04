// File API Types

export interface FileUploadRequest {
  file: File;
}

export interface FileUploadResponse {
  meta: {
    traceId?: string;
    success: boolean;
  } | null;
  data: {
    url?: string;
    mineType?: string;
  } | null;
}

