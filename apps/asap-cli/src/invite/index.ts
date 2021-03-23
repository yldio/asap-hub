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
const uuidMatch = /^([\d\w]{8})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{12})|[{0x]*([\d\w]{8})[0x, ]{4}([\d\w]{4})[0x, ]{4}([\d\w]{4})[0x, {]{5}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})$/;
export const inviteUsers = async (
  role: string,
  reinvite = false,
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
    sort: [{ path: 'created', order: 'ascending' }],
  });

  const usersToInvite = items.filter((u) => {
    const connections = u.data.connections.iv;
    if (connections.length === 0) {
      return true;
    }

    const authConnections = connections.filter((c) => !c.code.match(uuidMatch));
    if (reinvite && authConnections.length === 0) {
      return true;
    }

    return false;
  });

  await Promise.all(
    usersToInvite.map(async (user) => {
      await limiter();

      let code = user.data.connections.iv
        .map((c) => c.code)
        .find((c) => c.match(uuidMatch));

      if (!code) {
        code = uuidV4();
        console.log(`create invite code for ${user.data.email.iv}`);
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
      }

      const link = new url.URL(path.join(`/welcome/${code}`), origin);
      const [err2] = await Intercept(
        sendEmail({
          to: [user.data.email.iv],
          template: 'Welcome',
          values: {
            firstName: user.data.firstName.iv,
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

  if (items.length < take) {
    console.log('Found no more uninvited users');
    return;
  }

  await inviteUsers(role, reinvite, take, skip + take);
};

export default inviteUsers;
