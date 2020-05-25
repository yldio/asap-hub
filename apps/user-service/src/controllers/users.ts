import Boom from '@hapi/boom';
import { generate } from 'shortid';
import { ObjectId } from 'mongodb';
import { Db } from '../data';
import { UserModel } from '../data/users';

export interface User {
  id: string;
  displayName: string;
  email: string;
}

function transform(user: UserModel): User {
  return {
    id: user._id.toString(),
    displayName: user.displayName,
    email: user.email,
  } as User;
}

export default class Users {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.db.users.create({
      ...user,
      invite: {
        code: generate(),
        source: 'manual',
        createdAt: new Date(),
      },
    });

    return transform(createdUser);
  }

  async fetchByCode(code: string): Promise<User> {
    const user = await this.db.users.fetchByCode(code);
    if (user) {
      return transform(user);
    }
    throw Boom.forbidden();
  }

  async connectByCode(code: string, identity: string): Promise<User> {
    const user = await this.fetchByCode(code);
    await this.db.accounts.create({
      user: new ObjectId(user.id),
      identity,
    });
    return user;
  }
}
