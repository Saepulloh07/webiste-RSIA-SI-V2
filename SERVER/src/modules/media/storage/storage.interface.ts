export interface UploadedFileResult {
  url: string;
  sizeLabel: string;
}

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

export interface StorageProvider {
  /** Persists a buffer and returns its publicly-accessible URL + a human-readable size label. */
  save(file: Express.Multer.File): Promise<UploadedFileResult>;
  /** Best-effort delete; failures are logged, not thrown, so a DB row can still be removed. */
  delete(url: string): Promise<void>;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
