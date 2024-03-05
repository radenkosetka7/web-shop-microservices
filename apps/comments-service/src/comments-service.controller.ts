import { Controller } from '@nestjs/common';
import { CommentsServiceService } from './comments-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CommentsServiceController {
  constructor(
    private readonly commentsServiceService: CommentsServiceService,
  ) {}

  @MessagePattern('addComment')
  async createComment(data: any): Promise<any> {
    const { comment, user, product } = data;
    return await this.commentsServiceService.insert(comment, user, product);
  }

  @MessagePattern('productComments')
  async getProductComments(productId: string): Promise<any> {
    return await this.commentsServiceService.getAllCommentsByProductId(
      productId,
    );
  }

  @MessagePattern('answerComment')
  async answerComment(data: any): Promise<any> {
    const { id, answer } = data;
    return await this.commentsServiceService.answerComment(id, answer);
  }
}
