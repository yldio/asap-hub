/* eslint-disable no-console */
import Intercept from 'apr-intercept';
import { Squidex } from '@asap-hub/services-common';
import { RateLimit } from 'async-sema';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';
import url from 'url';
import { sendEmail } from './send-mail'

const origin = process.env.APP_ORIGIN || 'http://localhost:3000';

interface HTTPError extends Error {
  response?: {
    statusCode: number;
    body: string;
  };
}

interface SimpleUser {
  id: string,
  data: {
    displayName: { iv: string };
    email: { iv: string };
    role: { iv: string };
    connections: { iv: { code: string }[] };
  }
}

const squidex: Squidex<SimpleUser> = new Squidex('users');

const limiter = RateLimit(10);

const fetchUsersWithoutCode = async (role: string, take: number ) => {
  const { items } = await squidex.fetch({
    skip: 0,
    take,
    filter: {
      path: "data.role.iv",
      op: "eq",
      value: role
    },
    sort: [{ path: 'data.connections.iv', order: 'ascending' }],
  });
  return items
}

export const inviteUsers = async (role: string): Promise<void> => {
  const take = 20;
  const users = await fetchUsersWithoutCode(role, take)
  const usersWithoutConnections = users.filter(u => !u.data.connections || !u.data.connections.iv.length);

  await Promise.all(usersWithoutConnections.map(async user => {
    await limiter();

    const code = `asap|${uuidV4()}`

    const [err1] = await Intercept(squidex.patch(user.id, {
      email: user.data.email,
      connections: {
        iv: [{ code }]
      }
    }));

    const error = err1 as HTTPError
    if (error) {
      console.error({
        op: `patch '${user.id}'`,
        message: error.message,
        statusCode: error.response?.statusCode,
        body: error.response?.body,
      });
      Promise.reject(error)
    }

    const link = new url.URL(path.join(`/welcome/${code}`), origin);

    const [err2, res] = await Intercept(
      sendEmail({
        to: ['success@simulator.amazonses.com'], // TODO: change me
        template: 'Welcome',
        values: {
          firstName: user.data.displayName.iv,
          link: link.toString(),
        },
      }),
    );

    if (!err2) {
      console.log(`Invited user ${user.data.email}`);
      return Promise.resolve();
    }

    // error sending mail, remove inserted code
    await squidex.patch(user.id, {
      email: { iv: user.data.email.iv },
      connections: { iv: [] },
    });

    console.error(err2)
    Promise.reject()
  }))

  if (usersWithoutConnections.length === take) {
    return inviteUsers(role);
  }
  console.log("Found no more uninvited users")
};
