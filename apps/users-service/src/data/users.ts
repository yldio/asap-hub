import { generate } from 'shortid';
import Base, { BaseModel } from './base';

export interface Connection {
  id: string;
  raw: unknown;
  source: string;
}

export interface User extends BaseModel {
  connections: [Connection];
  displayName: string;
  email: string;
}

export interface CreateUser {
  displayName: string;
  email: string;
}

export default class Users extends Base<User> {
  async create(user: CreateUser): Promise<User> {
    const code = generate();
    return super.insertOne({
      ...user,
      connections: [code],
    });
  }

  async fetchByCode(code: string): Promise<User> {
    const res = await this.collection.findOne({
      connections: code,
    });

    return res as User;
  }

  async connectByCode(code: string, profile: Connection): Promise<User> {
    const res = await this.collection.findOneAndUpdate(
      {
        connections: code,
      },
      {
        $addToSet: {
          connections: profile.id,
        },
      },
    );

    return res as User;
  }
}
