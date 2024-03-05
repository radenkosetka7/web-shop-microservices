import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { RegisterRequest } from './models/requests/register.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from './models/requests/login.request';
import { UsersRepository } from './auth-service.repository';
import { ClientProxy } from '@nestjs/microservices';
import { AdminUserResponse } from './models/responses/admin-user.response';
import { UserRole } from './models/enums/user-role.enum';
import { UserStatus } from './models/enums/user-status.enum';
import { UpdateUserRequest } from './models/requests/update-user.request';
import { ChangePasswordRequest } from './models/requests/change-password.request';
import { AdminCreateUserRequest } from './models/requests/admin-user.request';
import { AdminUpdateUserRequest } from './models/requests/admin-user-update.request';
import { AccountActivationRequest } from './models/requests/activate-account.request';
import { lastValueFrom } from 'rxjs';
import { Not } from 'typeorm';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly repository: UsersRepository,
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  private codes: Map<string, string> = new Map<string, string>();

  async onModuleInit() {
    if ((await this.repository.count()) === 0) {
      const admin: AdminCreateUserRequest = {
        firstname: process.env.ADMIN_FIRSTNAME,
        lastname: process.env.ADMIN_LASTNAME,
        city: process.env.ADMIN_CITY,
        email: process.env.ADMIN_EMAIL,
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      };

      const support: AdminCreateUserRequest = {
        firstname: process.env.SUPPORT_FIRSTNAME,
        lastname: process.env.SUPPORT_LASTNAME,
        city: process.env.SUPPORT_CITY,
        email: process.env.SUPPORT_EMAIL,
        username: process.env.SUPPORT_USERNAME,
        password: process.env.SUPPORT_PASSWORD,
        role: UserRole.SUPPORT,
        status: UserStatus.ACTIVE,
      };

      const hashedPasswordAdmin = await bcrypt.hash(admin.password, 10);
      const hashedPasswordSupport = await bcrypt.hash(support.password, 10);

      admin.password = hashedPasswordAdmin;
      support.password = hashedPasswordSupport;

      await this.repository.save(admin);
      await this.repository.save(support);
    }
  }

  checkActivationCode(request: AccountActivationRequest): boolean {
    const storedCode = this.codes.get(request.username);
    return storedCode !== undefined && storedCode === request.code;
  }

  async sendActivationCode(username: string, email: string): Promise<any> {
    let code = String(Math.floor(Math.random() * 9000) + 1000);
    while (this.codes.has(code)) {
      code = String(Math.floor(Math.random() * 9000) + 1000);
    }
    this.codes.set(username, code);
    return await lastValueFrom(
      this.emailClient.send('activationCode', { email, code }),
    );
  }

  async activateAccount(username: string): Promise<any> {
    const user = await this.getUserByUsername(username, 1);
    if (user) {
      user.status = 0;
      const userResponse = await this.repository.save(user);
      const payload = {
        sub: userResponse.id,
        username: userResponse.username,
        role: userResponse.role,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    return null;
  }

  async register(user: RegisterRequest): Promise<any> {
    const existingUserEmail = await this.repository.findOne({
      where: { email: user.email },
    });
    if (existingUserEmail) {
      return {
        statusCode: 409,
        message: 'User with given e-mail already exist.',
      };
    }
    const existingUserUsername = await this.repository.findOne({
      where: { username: user.username },
    });
    if (existingUserUsername) {
      return {
        statusCode: 409,
        message: 'User with given username already exist.',
      };
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const response = await this.repository.save(user);
    this.sendActivationCode(response.username, user.email);
    return response;
  }

  async signIn(loginReq: LoginRequest): Promise<any> {
    const user = await this.getUserByUsername(loginReq.username, 0);
    if (user) {
      const isMatch: boolean = bcrypt.compareSync(
        loginReq.password,
        user.password,
      );
      if (!isMatch) {
        return {
          statusCode: 401,
          message: 'Invalid credentials. Please try again.',
        };
      }
      const payload = {
        sub: user.id,
        username: user.username,
        role: user.role,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    const userTemp = await this.getUserByUsername(loginReq.username, 1);
    if (userTemp) {
      return await this.sendActivationCode(userTemp.username, userTemp.email);
    }
    return {
      statusCode: 404,
      message: 'Invalid credentials. Please try again.',
    };
  }

  async getAll(page: number, pageSize: number): Promise<any> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const users = await this.repository.find({
      where: { role: Not(UserRole.ADMIN) },
    });
    const selectedUsers = users.splice(startIndex, endIndex);
    const adminUserResponses = selectedUsers.map((user) => {
      const adminUserResponse = new AdminUserResponse(user);
      adminUserResponse.role = UserRole[user.role];
      adminUserResponse.status = UserStatus[user.status];
      return adminUserResponse;
    });
    return { users: adminUserResponses, total: users.length };
  }

  async getUserByUsername(username: string, status: number): Promise<any> {
    const user = await this.repository.findOne({
      where: { username: username, status: status },
    });
    if (user) {
      return user;
    }
    return null;
  }

  async getById(id: string): Promise<any> {
    const user = await this.repository.findOne({
      where: { id: id },
    });
    if (!user) {
      return { statusCode: 404, message: 'User does not exist.' };
    }
    const filteredData = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      city: user.city,
      avatar: user.avatar,
      email: user.email,
    };
    return filteredData;
  }

  async updateUser(id: string, updateUser: UpdateUserRequest): Promise<any> {
    const user = await this.repository.findOne({ where: { id: id } });
    if (!user) {
      return { statusCode: 404, message: 'User does not exist.' };
    }
    if (user.id !== id) {
      return { statusCode: 403, message: 'Forbidden.' };
    }
    await this.repository.update(id, updateUser);
    return await this.repository.findOne({
      where: { id: id },
      select: [
        'id',
        'firstname',
        'lastname',
        'username',
        'city',
        'avatar',
        'email',
      ],
    });
  }

  async changePassword(
    id: string,
    changePassword: ChangePasswordRequest,
  ): Promise<any> {
    try {
      const user = await this.repository.findOne({ where: { id: id } });
      if (!user) {
        return { statusCode: 404, message: 'User does not exist.' };
      }
      if (user.id !== id) {
        return { statusCode: 403, message: 'Forbidden.' };
      }
      user.password = changePassword.password;
      await this.repository.save(user);
      return 'Password successfully changed.';
    } catch (error) {
      return 'An error occurred.';
    }
  }

  async adminRegisterUser(user: AdminCreateUserRequest): Promise<any> {
    const existingUser = await this.repository.findOne({
      where: [{ username: user.username }, { email: user.email }],
    });
    if (existingUser) {
      return {
        statusCode: 409,
        message: 'User with given e-mail or username already exist.',
      };
    }
    const createdUser = this.repository.save(user).then((user) => {
      const adminUserResponse = new AdminUserResponse(user);
      adminUserResponse.role = UserRole[user.role];
      adminUserResponse.status = UserStatus[user.status];
      return adminUserResponse;
    });
    return createdUser;
  }

  async adminUpdateUser(
    id: string,
    updateUser: AdminUpdateUserRequest,
  ): Promise<any> {
    const user = this.repository.findOne({
      where: { id: id },
    });
    if (!user) {
      return { statusCode: 404, message: 'User does not exist.' };
    }
    const savedUser = this.repository.save(updateUser).then((user) => {
      const adminUserResponse = new AdminUserResponse(user);
      adminUserResponse.role = UserRole[user.role];
      adminUserResponse.status = UserStatus[user.status];
      return adminUserResponse;
    });

    return savedUser;
  }

  async blockUser(id: string): Promise<any> {
    const user = await this.repository.findOne({ where: { id: id } });
    if (!user) {
      return { statusCode: 404, message: 'User does not exist.' };
    }
    user.status = 2;
    const updatedUser = this.repository.save(user).then((user) => {
      const adminUserResponse = new AdminUserResponse(user);
      adminUserResponse.role = UserRole[user.role];
      adminUserResponse.status = UserStatus[user.status];
      return adminUserResponse;
    });
    this.productClient.send('deleteUserProducts', id);
    return updatedUser;
  }
}
