import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createGoogleUser(userData: {
    email: string;
    googleId: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async linkGoogleAccount(
    id: string,
    googleId: string,
    picture?: string,
  ): Promise<User> {
    await this.userRepository.update(id, { googleId, picture });
    return this.userRepository.findOneByOrFail({ id });
  }
}