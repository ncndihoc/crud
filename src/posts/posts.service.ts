import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getAllPosts() {
    return 'All posts';
  }

  createPost(body: any) {
    return body;
  }

  getPostById(id: string) {
    return `Post ${id}`;
  }

  updatePost(id: string, body: any) {
    return `Post ${id} updated ${body}`;
  }

  deletePost(id: string) {
    return `Post ${id} deleted`;
  }
}
