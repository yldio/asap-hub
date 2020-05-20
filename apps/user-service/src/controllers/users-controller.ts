import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { generate } from 'shortid';
import { Db } from '../database';
import { UserModel } from '../database/users';

export interface User {
  id: string;
  displayName: string;
  email: string;
}

const schema = Joi.object({
  displayName: Joi.string().required(),
  email: Joi.string().email().required(),
});

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
    const { value, error } = schema.validate(user);
    if (error) {
      throw Boom.badRequest('Payload object is invalid.', error.details);
    }

    const createdUser = await this.db.users.create({
      ...value,
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

  async linkByCode(code: string, identity: string): Promise<User> {
    return transform(await this.db.users.linkByCode(code, identity));
  }
}
