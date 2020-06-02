import Boom from '@hapi/boom';
import aws from 'aws-sdk';
import got from 'got';
import Intercept from 'apr-intercept';
import { Db } from '../data';
import { User, CreateUser } from '../data/users';
import { auth0BaseUrl } from '../config';

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

const ses = new aws.SES({ apiVersion: '2010-12-01' });
export default class Users {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async create(user: CreateUser): Promise<ReplyUser> {
    const createdUser = await this.db.users.create({
      ...user,
    });

    const [connection] = createdUser.connections;
    const params = {
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<p>${connection}</p>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: `${connection}`,
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

  async fetchByCode(code: string): Promise<ReplyUser> {
    const user = await this.db.users.fetchByCode(code);
    if (user) {
      return transform(user);
    }
    throw Boom.forbidden();
  }

  async connectByCode(code: string, accessToken: string): Promise<User> {
    // use the provided accessToken to get information about the user
    const [err, res] = await Intercept(
      got(`${auth0BaseUrl}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }).json(),
    );

    if (err) {
      throw Boom.forbidden('Forbidden', {
        error: err,
      });
    }

    return this.db.users.connectByCode(code, {
      id: res.sub,
      source: 'auth0',
      raw: res,
    });
  }
}
