import { Inject, Injectable } from '@nestjs/common';
import { Comment } from './models/entities/comment.entity';
import { CommentsRepository } from './comments-service.repository';
import { CommentRequest } from './models/requests/comment.request';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CommentAnswerRequest } from './models/requests/comment-answer.request';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsServiceService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: CommentsRepository,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async insert(
    comment: CommentRequest,
    user: string,
    product: string,
  ): Promise<any> {
    const commentReq = {
      ...comment,
      creationDate: new Date().toDateString(),
      user: user,
      product: product,
    };
    const commentEntity = await this.commentsRepository.save(commentReq);
    const userEntity = await lastValueFrom(
      this.userClient.send('getUserById', commentEntity.user),
    );
    delete commentEntity.product;
    return { ...commentEntity, user: userEntity };
  }

  async getAllCommentsByProductId(productId: string): Promise<any[]> {
    const comments = await this.commentsRepository.find({
      where: { product: productId },
    });
    const commentsResp = await Promise.all(
      comments.map(async (comment) => {
        const userInfo = await lastValueFrom(
          this.userClient.send('getUserById', comment.user),
        );
        delete userInfo.id;
        delete comment.product;
        return { ...comment, user: userInfo };
      }),
    );
    return commentsResp;
  }

  async answerComment(id: string, answer: CommentAnswerRequest): Promise<any> {
    const comment = await this.commentsRepository.findOne({
      where: { id: id },
    });
    if (!comment) {
      return { statusCode: 404, message: 'Comment does not exist.' };
    }
    comment.answer = answer.answer;
    const commentEntity = await this.commentsRepository.save(comment);
    const userEntity = await lastValueFrom(
      this.userClient.send('getUserById', commentEntity.user),
    );
    delete commentEntity.product;
    return { ...commentEntity, user: userEntity };
  }
}
