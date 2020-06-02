import Boom from '@hapi/boom';
import { Db } from '../data';
import * as auth0 from '../entities/auth0';
import { CreateUser } from '../data/users';
import { User } from '../entities/user';
import { sendEmail } from '../utils/postman';

export interface ReplyUser {
  id: string;
  displayName: string;
  email: string;
}

const key = '_id';
function transform(user: User): ReplyUser {
  return {
    id: user[key].toString(),
    displayName: user.displayName,
    email: user.email,
  } as ReplyUser;
}

export default class Users {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async create(user: CreateUser): Promise<ReplyUser> {
    const createdUser = await this.db.users.create({
      ...user,
    });

    const [code] = createdUser.connections;
    await sendEmail({
      to: [user.email],
      template: 'welcome',
      values: {
        displayName: user.displayName,
        code,
      },
    });

    return transform(createdUser);
  }

  async fetchByCode(code: string): Promise<ReplyUser> {
    const user = await this.db.users.fetchByCode(code);
    if (user) {
      return transform(user);
    }
    throw Boom.forbidden();
  }

  async connectByCode(code: string, user: auth0.UserInfo): Promise<User> {
    return this.db.users.connectByCode(code, {
      id: user.sub,
      source: 'auth0',
      raw: user,
    });
  }
}
