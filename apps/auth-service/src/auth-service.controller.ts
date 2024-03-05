import { Controller, Get } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { RegisterRequest } from './models/requests/register.request';
import { AdminUserResponse } from './models/responses/admin-user.response';
import { AdminCreateUserRequest } from './models/requests/admin-user.request';
import { AccountActivationRequest } from './models/requests/activate-account.request';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern('activateAcc')
  async activateAccount(
    activateRequest: AccountActivationRequest,
  ): Promise<any> {
    if (this.authServiceService.checkActivationCode(activateRequest)) {
      return this.authServiceService.activateAccount(activateRequest.username);
    }
    return null;
  }
  @MessagePattern('registerUser')
  async register(user: RegisterRequest): Promise<any> {
    return await this.authServiceService.register(user);
  }

  @MessagePattern('login')
  async login(user: RegisterRequest): Promise<any> {
    return await this.authServiceService.signIn(user);
  }

  @MessagePattern('getUsers')
  async findAll(data: any): Promise<AdminUserResponse[]> {
    const { page, pageSize } = data;
    return await this.authServiceService.getAll(page, pageSize);
  }

  @MessagePattern('getUserById')
  async getById(id: string): Promise<any> {
    return await this.authServiceService.getById(id);
  }

  @MessagePattern('updateUser')
  async updateUser(data: any): Promise<any> {
    const { id, updateUser } = data;
    return await this.authServiceService.updateUser(id, updateUser);
  }

  @MessagePattern('changePassword')
  async changePassword(data: any): Promise<any> {
    const { id, changePassword } = data;
    return await this.authServiceService.changePassword(id, changePassword);
  }

  @MessagePattern('adminRegisterUser')
  async adminRegisterUser(user: AdminCreateUserRequest): Promise<any> {
    return await this.authServiceService.adminRegisterUser(user);
  }

  @MessagePattern('adminUpdateUser')
  async adminUpdateUser(data: any): Promise<any> {
    const { id, updateUser } = data;
    return await this.authServiceService.adminUpdateUser(id, updateUser);
  }

  @MessagePattern('blockUser')
  async blockUser(id: string): Promise<any> {
    return await this.authServiceService.blockUser(id);
  }

  @MessagePattern('uploadAvatarImage')
  async uploadAvatarImage(file: Express.Multer.File): Promise<string | null> {
    try {
      const dir = process.env.DIR;
      const imageName = uuidv4() + '_' + file.originalname;
      const imagePath = path.join(dir, imageName);
      const bufferData = Buffer.from(file.buffer);
      fs.writeFileSync(imagePath, bufferData);
      return imageName;
    } catch (error) {
      return null;
    }
  }
}
