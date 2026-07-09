import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories';
import { IUser, IJwtPayload } from '../interfaces';
import { JwtConfig } from '../config';
import { ConflictError, UnauthorizedError, NotFoundError } from '../errors';

interface UserResponse {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

interface LoginResponse {
  token: string;
  user: UserResponse;
}

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserResponse> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const existing = await this.userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.userRepository.create({
      name: data.name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
    });

    return AuthService.stripSensitiveFields(user);
  }

  public async login(data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload: IJwtPayload = { id: user.id, email: user.email };
    const token = jwt.sign(
      payload,
      JwtConfig.secret,
      { expiresIn: JwtConfig.expiresIn } as jwt.SignOptions,
    );

    return {
      token,
      user: AuthService.stripSensitiveFields(user),
    };
  }

  public async getProfile(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return AuthService.stripSensitiveFields(user);
  }

  private static stripSensitiveFields(user: IUser): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
