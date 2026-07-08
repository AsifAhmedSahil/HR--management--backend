import { Environment } from './environment';

export class JwtConfig {
  public static get secret(): string {
    return Environment.jwtSecret;
  }

  public static get expiresIn(): string {
    return Environment.jwtExpiresIn;
  }
}
