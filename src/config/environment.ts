import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export class Environment {
  public static get port(): number {
    return Number(process.env.PORT) || 3000;
  }

  public static get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  public static get isDevelopment(): boolean {
    return Environment.nodeEnv === 'development';
  }

  public static get isProduction(): boolean {
    return Environment.nodeEnv === 'production';
  }

  public static get dbHost(): string {
    return process.env.DB_HOST || 'localhost';
  }

  public static get dbPort(): number {
    return Number(process.env.DB_PORT) || 5432;
  }

  public static get dbName(): string {
    return process.env.DB_NAME || 'hr_management';
  }

  public static get dbUser(): string {
    return process.env.DB_USER || 'postgres';
  }

  public static get dbPassword(): string {
    return process.env.DB_PASSWORD || 'postgres';
  }

  public static get jwtSecret(): string {
    return process.env.JWT_SECRET || 'default-secret-change-in-production';
  }

  public static get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '7d';
  }

  public static get uploadDir(): string {
    return process.env.UPLOAD_DIR || 'uploads';
  }
}
