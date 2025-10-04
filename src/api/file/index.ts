// File API Client Exports
export * from './client';
export * from './config';
export * from './hooks';
export * from './types';
export * from './instance';

// Re-export the default file API client instance
export { fileApiClient as default } from './instance';