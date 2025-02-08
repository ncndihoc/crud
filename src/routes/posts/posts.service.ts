import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import envConfig from '../../shared/services/config';
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  getAllPosts() {
    console.log(envConfig.ACCESS_TOKEN_EXPIRATION);
    return this.prisma.post.findMany();
  }

  createPost(body: any) {
    return this.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(body.authorId),
      },
    });
  }

  getPostById(id: string) {
    return this.prisma.post.findUnique({
      where: { id: Number(id) },
    });
  }

  updatePost(id: string, body: any) {
    return this.prisma.post.update({
      where: { id: Number(id) },
      data: body,
    });
  }

  deletePost(id: string) {
    return this.prisma.post.delete({
      where: { id: Number(id) },
    });
  }
}
