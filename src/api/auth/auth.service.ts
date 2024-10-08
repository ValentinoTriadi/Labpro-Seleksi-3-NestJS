import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { Bcrypt } from 'src/utils/bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService extends UserService {
  constructor(private jwtService: JwtService) {
    super(new DatabaseService());
  }
  async login({ username, password }: LoginDto) {
    try {
      // Find existing user
      const existingUser = await this.findByEmailOrUsername(username);
      if (!existingUser || !existingUser.data) {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }
      // check password
      if (!Bcrypt.getInstance().compare(password, existingUser.data.password)) {
        return {
          status: 'error',
          message: 'Invalid Credentials',
          data: null,
        };
      }

      // login
      const { password: _, balance: __, ...user } = existingUser.data;
      _;
      __;
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

  selfInfo(token: string) {
    try {
      token = token.replace('Bearer ', '');
      const { user } = this.jwtService.verify(token);
      return {
        status: 'success',
        message: 'User found',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Invalid token',
        data: null,
      };
    }
  }

  logout() {
    return {
      status: 'success',
      message: 'User logged out',
      data: null,
    };
  }
}
