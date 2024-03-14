import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AccountActivationRequest } from 'apps/auth-service/src/models/requests/activate-account.request';
import { AdminUpdateUserRequest } from 'apps/auth-service/src/models/requests/admin-user-update.request';
import { AdminCreateUserRequest } from 'apps/auth-service/src/models/requests/admin-user.request';
import { ChangePasswordRequest } from 'apps/auth-service/src/models/requests/change-password.request';
import { LoginRequest } from 'apps/auth-service/src/models/requests/login.request';
import { RegisterRequest } from 'apps/auth-service/src/models/requests/register.request';
import { UpdateUserRequest } from 'apps/auth-service/src/models/requests/update-user.request';
import { AdminUserResponse } from 'apps/auth-service/src/models/responses/admin-user.response';
import { Category } from 'apps/categories-service/src/models/entities/category.entity';
import { CreateCategoryRequest } from 'apps/categories-service/src/models/requests/create-category.request';
import { UpdateAttributeRequest } from 'apps/categories-service/src/models/requests/update-attribute.request';
import { UpdateCategoryRequest } from 'apps/categories-service/src/models/requests/update-category.request';
import { CommentAnswerRequest } from 'apps/comments-service/src/models/requests/comment-answer.request';
import { CommentRequest } from 'apps/comments-service/src/models/requests/comment.request';
import { Message } from 'apps/messages-service/src/models/entities/message.entity';
import { MessageRequest } from 'apps/messages-service/src/models/requests/message.request';
import { Product } from 'apps/products-service/src/models/entities/product.entity';
import { ProductRequest } from 'apps/products-service/src/models/requests/products.request';
import { SearchRequest } from 'apps/products-service/src/models/requests/search.request';
import { ProductResponse } from 'apps/products-service/src/models/responses/product.response';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('MESSAGE_SERVICE') private readonly messageClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
    @Inject('COMMENT_SERVICE') private readonly commentClient: ClientProxy,
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
    @Inject('CATEGORY_SERVICE') private readonly categoryClient: ClientProxy,
  ) {}

  async getUsers(page: number, pageSize: number, name: string): Promise<any> {
    return await lastValueFrom(
      this.userClient.send('getUsers', { page, pageSize, name }),
    );
  }

  async login(user: LoginRequest): Promise<any> {
    return await lastValueFrom(this.userClient.send('login', user));
  }

  async activateAccount(
    activateRequest: AccountActivationRequest,
  ): Promise<any> {
    return await lastValueFrom(
      this.userClient.send('activateAcc', activateRequest),
    );
  }
  async registerUser(user: RegisterRequest): Promise<any> {
    return await lastValueFrom(this.userClient.send('registerUser', user));
  }

  async getUsersByUserId(id: string): Promise<any> {
    return await lastValueFrom(this.userClient.send('getUserById', id));
  }

  async updateUser(id: string, updateUser: UpdateUserRequest): Promise<any> {
    return await lastValueFrom(
      this.userClient.send('updateUser', { id, updateUser }),
    );
  }

  async changePassword(
    id: string,
    changePassword: ChangePasswordRequest,
  ): Promise<any> {
    return await lastValueFrom(
      this.userClient.send('changePassword', { id, changePassword }),
    );
  }

  async adminRegisterUser(user: AdminCreateUserRequest): Promise<any> {
    return await lastValueFrom(this.userClient.send('adminRegisterUser', user));
  }

  async adminUpdateUser(
    id: string,
    updateUser: AdminUpdateUserRequest,
  ): Promise<any> {
    return await lastValueFrom(
      this.userClient.send('adminUpdateUser', { id, updateUser }),
    );
  }

  async blockUser(id: string): Promise<any> {
    return await lastValueFrom(this.userClient.send('blockUser', id));
  }

  async uploadAvatarImage(
    file: Express.Multer.File,
    uid: string,
  ): Promise<string | null> {
    return await lastValueFrom(
      this.userClient.send('uploadAvatarImage', { file, uid }),
    );
  }

  async readMessage(id: string): Promise<any> {
    return await lastValueFrom(this.messageClient.send('readMessage', id));
  }

  async createMessage(message: MessageRequest, id: string): Promise<Message> {
    return await lastValueFrom(
      this.messageClient.send('createMessage', { message, id }),
    );
  }

  async getAllMessages(
    page: number,
    pageSize: number,
    content: string,
  ): Promise<any> {
    return await lastValueFrom(
      this.messageClient.send('getAllMessages', { page, pageSize, content }),
    );
  }

  async getMessageById(id: string): Promise<any> {
    return await lastValueFrom(this.messageClient.send('getMessage', id));
  }

  async createProduct(
    product: ProductRequest,
    id: string,
  ): Promise<ProductResponse> {
    return await lastValueFrom(
      this.productClient.send('createProduct', { product, id }),
    );
  }

  async getAllProducts(
    page: number,
    pageSize: number,
    title: string,
  ): Promise<any> {
    return await lastValueFrom(
      this.productClient.send('getProducts', { page, pageSize, title }),
    );
  }

  async getProductById(id: string): Promise<any> {
    return await lastValueFrom(this.productClient.send('getProductById', id));
  }

  async deleteProduct(id: string): Promise<any> {
    return await lastValueFrom(this.productClient.send('deleteProduct', id));
  }

  async getAllProductsForBuyer(
    page: number,
    pageSize: number,
    title: string,
    id: string,
  ): Promise<any> {
    return await lastValueFrom(
      this.productClient.send('purchasedProducts', {
        page,
        pageSize,
        title,
        id,
      }),
    );
  }

  async getAllProductsForSeller(
    page: number,
    pageSize: number,
    title: string,
    finished: number,
    id: string,
  ): Promise<any> {
    return await lastValueFrom(
      this.productClient.send('soldProducts', {
        page,
        pageSize,
        title,
        finished,
        id,
      }),
    );
  }

  async uploadProductImages(
    files: Express.Multer.File[],
    uids: string[],
  ): Promise<string[] | null> {
    return await lastValueFrom(
      this.productClient.send('uploadProductImages', { files, uids }),
    );
  }

  async purchaseProduct(id: string, userId: string): Promise<any> {
    return await lastValueFrom(
      this.productClient.send('purchaseProduct', { id, userId }),
    );
  }

  async createComment(
    comment: CommentRequest,
    user: string,
    product: string,
  ): Promise<any> {
    return await lastValueFrom(
      this.commentClient.send('addComment', { comment, user, product }),
    );
  }
  async answerComment(id: string, answer: CommentAnswerRequest): Promise<any> {
    return await lastValueFrom(
      this.commentClient.send('answerComment', { id, answer }),
    );
  }

  async replyMessage(
    mail: string,
    question: string,
    answer: string,
  ): Promise<any> {
    return await lastValueFrom(
      this.emailClient.send('replyMessage', { mail, question, answer }),
    );
  }

  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    return await lastValueFrom(
      this.categoryClient.send('createCategory', category),
    );
  }

  async updateCategory(
    id: string,
    category: UpdateCategoryRequest,
  ): Promise<any> {
    return await lastValueFrom(
      this.categoryClient.send('updateCategory', { id, category }),
    );
  }

  async getAttributesByCategoryId(id: string): Promise<any> {
    return await lastValueFrom(
      this.categoryClient.send('getAttributesByCategoryId', id),
    );
  }

  async getCategories(): Promise<Category[]> {
    return await lastValueFrom(this.categoryClient.send('getCategories', {}));
  }

  async getCategoryById(id: string): Promise<any> {
    return await lastValueFrom(this.categoryClient.send('getCategoryById', id));
  }

  async updateAttribute(
    id: string,
    attribute: UpdateAttributeRequest,
  ): Promise<any> {
    return await lastValueFrom(
      this.categoryClient.send('updateAttribute', { id, attribute }),
    );
  }

  async deleteCategory(id: string): Promise<any> {
    return await lastValueFrom(this.categoryClient.send('deleteCategory', id));
  }

  async searchProducts(
    page: number,
    pageSize: number,
    request: SearchRequest,
  ): Promise<any> {
    return await lastValueFrom(
      this.productClient.send('searchProducts', {
        page,
        pageSize,
        request,
      }),
    );
  }
}
