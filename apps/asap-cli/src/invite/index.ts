/* eslint-disable no-console */
import Intercept from 'apr-intercept';
import { Squidex, RestUser, Query, RestTeam } from '@asap-hub/squidex';
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

const userClient: Squidex<RestUser> = new Squidex('users');
const teamClient: Squidex<RestTeam> = new Squidex('teams');

const limiter = RateLimit(10);
const uuidMatch = /^([\d\w]{8})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{12})|[{0x]*([\d\w]{8})[0x, ]{4}([\d\w]{4})[0x, ]{4}([\d\w]{4})[0x, {]{5}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})$/;
export const inviteUsers = async (
  role?: string,
  reinvite = false,
  take = 20,
  skip = 0,
): Promise<void> => {
  const query: Query = {
    skip,
    take,
    sort: [{ path: 'created', order: 'ascending' }],
  };

  if (role) {
    query.filter = {
      path: 'data.role.iv',
      op: 'eq',
      value: role,
    };
  }

  const { items } = await userClient.fetch(query);

  const usersToInvite = items.filter((u) => {
    const connections = u.data.connections.iv;
    if (!connections || connections.length === 0) {
      return true;
    }

    const authConnections = connections.filter((c) => !c.code.match(uuidMatch));
    if (reinvite && authConnections.length === 0) {
      return true;
    }

    return false;
  });

  const userTeamIds = usersToInvite
    .flatMap((user) => user.data.teams.iv)
    .flatMap((team) => team?.id)
    .filter((team) => typeof team !== 'undefined');

  let teamMap: { [key: string]: string } | undefined;
  if (userTeamIds.length > 0) {
    const teamQuery: Query = {
      skip,
      take,
      filter: {
        path: 'id',
        op: 'in',
        value: userTeamIds.join(','),
      },
    };
    const { items: teams } = await teamClient.fetch(teamQuery);
    teamMap = teams.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next.data.displayName.iv,
      }),
      {},
    );
  }

  await Promise.all(
    usersToInvite.map(async (user) => {
      await limiter();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let code = user.data.connections
        .iv! // asserting not null as the nulls values are filtered in usersToInvite
        .map((c) => c.code)
        .find((c) => c.match(uuidMatch));

      if (!code) {
        code = uuidV4();
        console.log(`create invite code for ${user.data.email.iv}`);
        const [err1] = await Intercept(
          userClient.patch(user.id, {
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
        let userTeams;
        if (teamMap) {
          userTeams = user.data.teams.iv
            ?.flatMap((team) => team.id)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map((id) => teamMap![id])
            .join(', ');
        }
        console.log(
          `Invited user ${user.data.email.iv} ${userTeams && `(${userTeams})`}`,
        );
        return;
      }

      // error sending mail, remove inserted code
      await userClient.patch(user.id, {
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
