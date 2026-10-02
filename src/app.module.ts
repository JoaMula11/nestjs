import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mssql',
    host: '127.0.0.1', 
    port: 1433,
    database: 'nestjs', 
    username: 'sa',
    password: 'joamula15243',
    options: {
      encrypt: false,
      trustServerCertificate: true,
      instanceName: 'SQLEXPRESS01', 
    },
    entities: [User],
    synchronize: true,
  }),
  inject: [ConfigService],
}),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}