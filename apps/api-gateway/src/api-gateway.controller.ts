import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { AdminUserResponse } from 'apps/auth-service/src/models/responses/admin-user.response';
import { RegisterRequest } from 'apps/auth-service/src/models/requests/register.request';
import { UpdateUserRequest } from 'apps/auth-service/src/models/requests/update-user.request';
import { ChangePasswordRequest } from 'apps/auth-service/src/models/requests/change-password.request';
import { AdminCreateUserRequest } from 'apps/auth-service/src/models/requests/admin-user.request';
import { AdminUpdateUserRequest } from 'apps/auth-service/src/models/requests/admin-user-update.request';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MessageRequest } from 'apps/messages-service/src/models/requests/message.request';
import { ProductRequest } from 'apps/products-service/src/models/requests/products.request';
import { Product } from 'apps/products-service/src/models/entities/product.entity';
import { CommentRequest } from 'apps/comments-service/src/models/requests/comment.request';
import { CommentAnswerRequest } from 'apps/comments-service/src/models/requests/comment-answer.request';
import { Message } from 'apps/messages-service/src/models/entities/message.entity';
import { CreateCategoryRequest } from 'apps/categories-service/src/models/requests/create-category.request';
import { Category } from 'apps/categories-service/src/models/entities/category.entity';
import { UpdateAttributeRequest } from 'apps/categories-service/src/models/requests/update-attribute.request';
import { ProductResponse } from 'apps/products-service/src/models/responses/product.response';
import { UpdateCategoryRequest } from 'apps/categories-service/src/models/requests/update-category.request';
import { SearchRequest } from 'apps/products-service/src/models/requests/search.request';
import { AllExceptionsFilter } from './util/exception-handler';
import { LoginRequest } from 'apps/auth-service/src/models/requests/login.request';
import { AccountActivationRequest } from 'apps/auth-service/src/models/requests/activate-account.request';
import { Roles } from './util/roles.decorator';
import { UserRole } from 'apps/auth-service/src/models/enums/user-role.enum';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/role.guard';

@Controller('gateway')
@UseFilters(AllExceptionsFilter)
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get('users')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<any> {
    return await this.apiGatewayService.getUsers(page, pageSize);
  }

  @Post('activateAccount')
  async activateAccount(
    @Body()
    activateRequest: AccountActivationRequest,
  ): Promise<any> {
    const result =
      await this.apiGatewayService.activateAccount(activateRequest);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  @Post('login')
  async login(@Body() user: LoginRequest): Promise<any> {
    const result = await this.apiGatewayService.login(user);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  @Post('register')
  async registerUser(@Body() user: RegisterRequest): Promise<any> {
    const result = await this.apiGatewayService.registerUser(user);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    delete result.password;
    return result;
  }

  @Get('userInfo')
  @UseGuards(AuthGuard)
  async getUserById(@Req() request: Request): Promise<any> {
    const authenticatedUser = request['user'];
    const userReq = await this.apiGatewayService.getUsersByUserId(
      authenticatedUser.sub,
    );
    if (userReq?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(userReq?.statusCode);
      throw new HttpException(
        { statusCode: userReq?.statusCode, message: userReq?.message },
        httpStatus,
      );
    }
    return userReq;
  }

  @Put('users/:id')
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserRequest,
  ): Promise<any> {
    const user = await this.apiGatewayService.updateUser(id, updateUser);
    if (user?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(user?.statusCode);
      throw new HttpException(
        { statusCode: user?.statusCode, message: user?.message },
        httpStatus,
      );
    }
    return user;
  }
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('users/:id/changePassword')
  async changePassword(
    @Param('id') id: string,
    @Body() changePassword: ChangePasswordRequest,
  ): Promise<any> {
    const user = await this.apiGatewayService.changePassword(
      id,
      changePassword,
    );
    if (user?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(user?.statusCode);
      throw new HttpException(
        { statusCode: user?.statusCode, message: user?.message },
        httpStatus,
      );
    }
    return user;
  }

  @Post('admin/createUser')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async adminRegisterUser(
    @Body() user: AdminCreateUserRequest,
  ): Promise<AdminUserResponse> {
    const result = await this.apiGatewayService.adminRegisterUser(user);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  @Put('admin/:id/updateUser')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async adminUpdateUser(
    @Param('id') id: string,
    @Body() updateUser: AdminUpdateUserRequest,
  ): Promise<any> {
    const result = await this.apiGatewayService.adminUpdateUser(id, updateUser);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  @Put('admin/:id/blockUser')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async blockUser(@Param('id') id: string): Promise<any> {
    const result = await this.apiGatewayService.blockUser(id);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatarImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string | null> {
    return await this.apiGatewayService.uploadAvatarImage(file);
  }

  @Put('messages/:id')
  @Roles(UserRole.SUPPORT)
  @UseGuards(AuthGuard, RolesGuard)
  async readMessage(@Param('id') id: string): Promise<any> {
    const message = await this.apiGatewayService.readMessage(id);
    if (message?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(message?.statusCode);
      throw new HttpException(
        { statusCode: message?.statusCode, message: message?.message },
        httpStatus,
      );
    }
    return message;
  }

  @Post('messages')
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  async createMessage(
    @Body() message: MessageRequest,
    @Req() request: Request,
  ): Promise<Message> {
    const authenticatedUser = request['user'];
    return await this.apiGatewayService.createMessage(
      message,
      authenticatedUser.sub,
    );
  }

  @Get('messages')
  @Roles(UserRole.SUPPORT)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllMessages(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<any> {
    return await this.apiGatewayService.getAllMessages(page, pageSize);
  }

  @Roles(UserRole.SUPPORT)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('messages/:id')
  async getMessageById(@Param('id') id: string): Promise<any> {
    const message = await this.apiGatewayService.getMessageById(id);
    if (message?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(message?.statusCode);
      throw new HttpException(
        { statusCode: message?.statusCode, message: message?.message },
        httpStatus,
      );
    }
    return message;
  }

  @Post('replyMessage')
  @Roles(UserRole.SUPPORT)
  @UseGuards(AuthGuard, RolesGuard)
  async replyMessage(
    @Query('mail') mail: string,
    @Query('question') question: string,
    @Query('answer') answer: string,
  ): Promise<any> {
    const result = await this.apiGatewayService.replyMessage(
      mail,
      question,
      answer,
    );
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  @Post('products')
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  async createProduct(
    @Body() product: ProductRequest,
    @Req() request: Request,
  ): Promise<ProductResponse> {
    const authenticatedUser = request['user'];
    return await this.apiGatewayService.createProduct(
      product,
      authenticatedUser.sub,
    );
  }

  @Get('products')
  async getAllProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('title') title: string | null,
  ): Promise<any> {
    return await this.apiGatewayService.getAllProducts(page, pageSize, title);
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string): Promise<any> {
    const product = await this.apiGatewayService.getProductById(id);
    if (product?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(product?.statusCode);
      throw new HttpException(
        { statusCode: product?.statusCode, message: product?.message },
        httpStatus,
      );
    }
    return product;
  }

  @Delete('products/:id')
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteProduct(@Param('id') id: string): Promise<any> {
    const product = await this.apiGatewayService.deleteProduct(id);
    if (product?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(product?.statusCode);
      throw new HttpException(
        { statusCode: product?.statusCode, message: product?.message },
        httpStatus,
      );
    }
    return product;
  }

  @Get('purchasedProducts')
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllProductsForBuyer(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('title') title: string | null,
    @Req() request: Request,
  ): Promise<any> {
    const authenticatedUser = request['user'];
    return await this.apiGatewayService.getAllProductsForBuyer(
      page,
      pageSize,
      title,
      authenticatedUser.sub,
    );
  }

  @Get('soldProducts')
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllProductsForSeller(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('title') title: string | null,
    @Query('finished', new DefaultValuePipe(0), ParseIntPipe) finished: number,
    @Req() request: Request,
  ): Promise<any> {
    const authenticatedUser = request['user'];
    return await this.apiGatewayService.getAllProductsForSeller(
      page,
      pageSize,
      title,
      finished,
      authenticatedUser.sub,
    );
  }

  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('products/uploadImages')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadProductImages(
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ): Promise<string[] | null> {
    return await this.apiGatewayService.uploadProductImages(files);
  }

  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('products/purchase/:id')
  async purchaseProduct(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<any> {
    const authenticatedUser = request['user'];
    const product = await this.apiGatewayService.purchaseProduct(
      id,
      authenticatedUser.sub,
    );
    if (product?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(product?.statusCode);
      throw new HttpException(
        { statusCode: product?.statusCode, message: product?.message },
        httpStatus,
      );
    }
    return product;
  }

  @Post('products/search')
  async searchProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Body() searchRequest: SearchRequest,
  ): Promise<any> {
    return await this.apiGatewayService.searchProducts(
      page,
      pageSize,
      searchRequest,
    );
  }

  @Post('comments/:id')
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  async createComment(
    @Body() comment: CommentRequest,
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<any> {
    const authenticatedUser = request['user'];
    return await this.apiGatewayService.createComment(
      comment,
      authenticatedUser.sub,
      id,
    );
  }

  @Put('comments/:id')
  @Roles(UserRole.ORDINARY)
  @UseGuards(AuthGuard, RolesGuard)
  async answerComment(
    @Param('id') id: string,
    @Body() answer: CommentAnswerRequest,
  ): Promise<any> {
    const result = await this.apiGatewayService.answerComment(id, answer);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  @Post('categories')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async createCategory(
    @Body() category: CreateCategoryRequest,
  ): Promise<Category> {
    return await this.apiGatewayService.createCategory(category);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: UpdateCategoryRequest,
  ): Promise<any> {
    const result = await this.apiGatewayService.updateCategory(id, category);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return { product: result };
  }

  @Get('categories/:id/attributes')
  @Roles(UserRole.ORDINARY, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAttributesByCategoryId(@Param('id') id: string): Promise<any> {
    const attributes =
      await this.apiGatewayService.getAttributesByCategoryId(id);
    if (attributes?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(attributes?.statusCode);
      throw new HttpException(
        { statusCode: attributes?.statusCode, message: attributes?.message },
        httpStatus,
      );
    }
    return attributes;
  }

  @Get('categories')
  @Roles(UserRole.ORDINARY, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getCategories(): Promise<Category[]> {
    return await this.apiGatewayService.getCategories();
  }

  @Get('categories/:id')
  @Roles(UserRole.ORDINARY, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getCategoryById(@Param('id') id: string): Promise<any> {
    const category = await this.apiGatewayService.getCategoryById(id);
    if (category?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(category?.statusCode);
      throw new HttpException(
        { statusCode: category?.statusCode, message: category?.message },
        httpStatus,
      );
    }
    return category;
  }

  @Put('attributes/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateAttribute(
    @Param('id') id: string,
    @Body() attribute: UpdateAttributeRequest,
  ): Promise<any> {
    const result = await this.apiGatewayService.updateAttribute(id, attribute);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteCategory(@Param('id') id: string): Promise<any> {
    const result = await this.apiGatewayService.deleteCategory(id);
    if (result?.statusCode) {
      const httpStatus = this.mapStatusCodeToHttpStatus(result?.statusCode);
      throw new HttpException(
        { statusCode: result?.statusCode, message: result?.message },
        httpStatus,
      );
    }
    return result;
  }

  private mapStatusCodeToHttpStatus(statusCode: number): HttpStatus {
    switch (statusCode) {
      case 400:
        return HttpStatus.BAD_REQUEST;
      case 401:
        return HttpStatus.UNAUTHORIZED;
      case 403:
        return HttpStatus.FORBIDDEN;
      case 404:
        return HttpStatus.NOT_FOUND;
      case 409:
        return HttpStatus.CONFLICT;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
