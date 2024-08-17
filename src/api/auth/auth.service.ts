import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const dummyUser = [
  {
    username: 'user1',
    password: 'password1',
  },
  {
    username: 'user2',
    password: 'password2',
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login({ username, password }: LoginDto) {
    try {
      // Find existing user
      const existingUser = dummyUser.find((user) => user.username === username);
      if (!existingUser) {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }

      // check password
      if (existingUser.password !== password) {
        return {
          status: 'error',
          message: 'Invalid Credentials',
          data: null,
        };
      }

      // login
      const { password: _, ...user } = existingUser;
      _;
      const token = this.jwtService.sign({ user });
      return {
        status: 'success',
        message: 'User logged in',
        data: { username: user.username, token },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Something went wrong',
        data: null,
      };
    }
  }

  self(token: string) {
    try {
      token = token.replace('Bearer ', '');
      const { user } = this.jwtService.verify(token);
      return {
        status: 'success',
        message: 'User found',
        data: { username: user.username, token },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Invalid token',
        data: null,
      };
    }
  }
}
