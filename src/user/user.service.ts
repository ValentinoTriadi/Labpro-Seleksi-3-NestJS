import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RegisterDto } from './dto/user.dto';
import { Bcrypt } from 'src/utils/bcrypt';
import { ROLE } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(q?: string) {
    try {
      const where = q ? { username: { contains: q } } : {};
      const users = await this.databaseService.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
        },
        where: {
          ...where,
          role: {
            not: ROLE.ADMIN,
          },
        },
      });
      return {
        status: 'success',
        message: 'Users fetched successfully',
        data: users,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
        },
        where: { id },
      });
      if (!user) {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }
      return {
        status: 'success',
        message: 'User fetched successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { username },
      });
      if (!user) {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }
      return {
        status: 'success',
        message: 'User fetched successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email },
      });
      if (!user) {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }
      return {
        status: 'success',
        message: 'User fetched successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async findByEmailOrUsername(data: string) {
    try {
      const user = await this.databaseService.user.findFirst({
        where: {
          OR: [
            {
              username: data,
            },
            {
              email: data,
            },
          ],
        },
      });
      if (!user) {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }
      return {
        status: 'success',
        message: 'User fetched successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const {
        email,
        username,
        password,
        confirmPassword,
        firstName,
        lastName,
      } = registerDto;

      // Check password match
      if (password !== confirmPassword) {
        return {
          status: 'error',
          message: 'Password does not match',
          data: null,
        };
      }

      // Check Password Validation
      if (password.length < 8) {
        return {
          status: 'error',
          message: 'Password must be at least 8 characters',
          data: null,
        };
      }
      if (!/[A-Z]/.test(password)) {
        return {
          status: 'error',
          message: 'Password must contain at least one uppercase letter',
          data: null,
        };
      }
      if (!/[a-z]/.test(password)) {
        return {
          status: 'error',
          message: 'Password must contain at least one lowercase letter',
          data: null,
        };
      }
      if (!/[0-9]/.test(password)) {
        return {
          status: 'error',
          message: 'Password must contain at least one number',
          data: null,
        };
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        return {
          status: 'error',
          message: 'Password must contain at least one special character',
          data: null,
        };
      }

      // Check existing user
      const existingUser = await this.findByUsername(username);
      if (existingUser.data) {
        return {
          status: 'error',
          message: 'Username already taken',
          data: null,
        };
      }

      // Check existing email
      const existingEmail = await this.findByEmail(email);
      if (existingEmail.data) {
        return {
          status: 'error',
          message: 'Email already taken',
          data: null,
        };
      }

      // Create user
      const user = await this.databaseService.user.create({
        data: {
          email,
          username,
          password: Bcrypt.getInstance().encode(password),
          firstName,
          lastName,
        },
      });
      return {
        status: 'success',
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Something went wrong',
        data: null,
      };
    }
  }

  async getUserBalance(userId: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return 0;
      }
      return user.balance;
    } catch (error) {
      return 0;
    }
  }

  async updateBalance(userId: string, inc: number) {
    try {
      const user = await this.findOne(userId);
      if (user.status === 'error') {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }

      const result = await this.databaseService.user.update({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
        },
        data: {
          balance: {
            increment: inc,
          },
        },
      });
      return {
        status: 'success',
        message: 'Balance updated successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async delete(id: string) {
    try {
      const user = await this.findOne(id);
      if (user.status === 'error') {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }

      const result = await this.databaseService.user.delete({
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
        },
        where: { id },
      });
      return {
        status: 'success',
        message: 'User deleted successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }
}
