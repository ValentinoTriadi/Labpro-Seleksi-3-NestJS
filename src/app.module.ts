import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './api/films/films.module';
import { AuthModule } from './api/auth/auth.module';
import { FilmsService } from './api/films/films.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserMiddleware } from './middleware/User.middleware';
import { AuthRouteMiddleware } from './middleware/AuthRoute.middleware';
import { ProtectedRouteMiddleware } from './middleware/ProtectedRoute.middleware';
import { FileService } from './file/file.service';
import { FileController } from './file/file.controller';
import { FileModule } from './file/file.module';
import { UserModule } from './api/user/user.module';
import { UsersModule } from './api/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    FilmsModule,
    AuthModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    FileModule,
    UsersModule,
  ],
  controllers: [AppController, FileController],
  providers: [AppService, FilmsService, UserService, FileService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes('*')
      .apply(AuthRouteMiddleware)
      .forRoutes('/login', '/register')
      .apply(ProtectedRouteMiddleware)
      .forRoutes('/dashboard', '/logout', 'films/:id/buy');
  }
}
