import path from 'path';
import { Environment } from './environment';

export class UploadConfig {
  public static get uploadDir(): string {
    return path.resolve(__dirname, '../../', Environment.uploadDir);
  }

  public static get maxFileSize(): number {
    return 5 * 1024 * 1024; // 5 MB
  }

  public static get allowedMimeTypes(): string[] {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  }
}
