// File API Configuration

export const FILE_API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_FILE_API_URL || 'https://api.storage.app.riviu.com.vn',
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Accept': 'application/json',
  },
} as const;

export const FILE_ENDPOINTS = {
  UPLOAD: '/App/File/Upload',
} as const;