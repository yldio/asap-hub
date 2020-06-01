import Boom from '@hapi/boom';
import aws from 'aws-sdk';
import { generate } from 'shortid';
import { ObjectId } from 'mongodb';
import { Db } from '../data';
import { UserModel } from '../data/users';

export interface User {
  id: string;
  displayName: string;
  email: string;
}

const key = '_id';
function transform(user: UserModel): User {
  return {
    id: user[key].toString(),
    displayName: user.displayName,
    email: user.email,
  } as User;
}

const ses = new aws.SES({ apiVersion: '2010-12-01' });
export default class Users {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async create(user: User): Promise<User> {
    const code = generate();
    const createdUser = await this.db.users.create({
      ...user,
      invite: {
        code,
        source: 'manual',
        createdAt: new Date(),
      },
    });

    const params = {
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<p>${code}</p>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: `${code}`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Welcome',
        },
      },
      Source: 'no-reply@asap.yld.io',
    };
    await ses.sendEmail(params).promise();
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
