import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(password: string) {
    return hash(password, 10);
  }

  async compare(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
  }
}
