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
    // 1. Buscar si el usuario ya existe por su googleId
    let user = await this.usersService.findByGoogleId(profile.googleId);

    if (!user) {
      // 2. Buscar si existe por email para evitar registros duplicados
      user = await this.usersService.findByEmail(profile.email);

      if (user) {
        // Enlazar cuenta existente local con Google
        user = await this.usersService.linkGoogleAccount(
          user.id,
          profile.googleId,
          profile.picture,
        );
      } else {
        // 3. Crear nuevo usuario federado si no existe
        user = await this.usersService.createGoogleUser({
          email: profile.email,
          googleId: profile.googleId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          picture: profile.picture,
        });
      }
    }

    // 4. Firmar el token JWT propio de la aplicación
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