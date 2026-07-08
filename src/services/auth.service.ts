import { UserRepository } from '../repositories';

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // TODO: Implement register
  // TODO: Implement login
  // TODO: Implement getProfile
}
