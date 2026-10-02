import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';

interface GoogleProfilePayload {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: GoogleProfilePayload) {
    let user = await this.usersService.findByGoogleId(profile.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(profile.email);

      if (user) {
        user = await this.usersService.linkGoogleAccount(
          user.id,
          profile.googleId,
          profile.picture,
        );
      } else {
        user = await this.usersService.createGoogleUser({
          email: profile.email,
          googleId: profile.googleId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          picture: profile.picture,
        });
      }
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
    };
  }
}