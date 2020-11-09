/* eslint-disable no-console */
import Intercept from 'apr-intercept';
import { Squidex, RestUser } from '@asap-hub/squidex';
import { RateLimit } from 'async-sema';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';
import url from 'url';
import { sendEmail } from './send-mail';
import { origin } from '../config';

interface HTTPError extends Error {
  response?: {
    statusCode: number;
    body: string;
  };
}

const squidex: Squidex<RestUser> = new Squidex('users');

const limiter = RateLimit(10);

export const inviteUsers = async (
  role: string,
  take = 20,
  skip = 0,
): Promise<void> => {
  const { items } = await squidex.fetch({
    skip,
    take,
    filter: {
      path: 'data.role.iv',
      op: 'eq',
      value: role,
    },
    sort: [{ path: 'data.connections.iv', order: 'ascending' }],
  });

  const usersWithoutConnections = items.filter(
    (u) => !u.data.connections || !u.data.connections.iv.length,
  );

  await Promise.all(
    usersWithoutConnections.map(async (user) => {
      await limiter();

      const code = uuidV4();
      const [err1] = await Intercept(
        squidex.patch(user.id, {
          email: user.data.email,
          connections: {
            iv: [{ code }],
          },
        }),
      );

      const error = err1 as HTTPError;
      if (error) {
        console.log({
          op: `patch '${user.id}'`,
          message: error.message,
          statusCode: error.response?.statusCode,
          body: error.response?.body,
        });
        throw err1;
      }

      const link = new url.URL(path.join(`/welcome/${code}`), origin);

      const [err2] = await Intercept(
        sendEmail({
          to: [user.data.email.iv],
          template: 'Welcome',
          values: {
            firstName: user.data.firstName.iv,
            lastName: user.data.lastName.iv,
            link: link.toString(),
          },
        }),
      );

      if (!err2) {
        console.log(`Invited user ${user.data.email.iv}`);
        return;
      }

      // error sending mail, remove inserted code
      await squidex.patch(user.id, {
        email: user.data.email,
        connections: { iv: [] },
      });

      throw err2;
    }),
  );

  if (usersWithoutConnections.length === take) {
    await inviteUsers(role, take, skip);
    return;
  }
  console.log('Found no more uninvited users');
};

export default inviteUsers;
