import Intercept from 'apr-intercept';
import { Squidex, RestUser, Query, RestTeam } from '@asap-hub/squidex';
import { RateLimit } from 'async-sema';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';
import url from 'url';
import { sendEmail } from './send-mail';
import { origin } from '../config';
import logger from '../logger';

interface HTTPError extends Error {
  response?: {
    statusCode: number;
    body: string;
  };
}

interface inviteUsersFn {
  /* eslint-disable no-unused-vars */
  (
    role?: string,
    reinvite?: boolean,
    take?: number,
    skip?: number,
  ): Promise<void>;
  /* eslint-enable no-unused-vars */
}

const inviteUsersFactory = (
  log: typeof console.log = logger,
): inviteUsersFn => {
  const userClient: Squidex<RestUser> = new Squidex('users');
  const teamClient: Squidex<RestTeam> = new Squidex('teams');

  const limiter = RateLimit(10);
  const uuidMatch = /^([\d\w]{8})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{12})|[{0x]*([\d\w]{8})[0x, ]{4}([\d\w]{4})[0x, ]{4}([\d\w]{4})[0x, {]{5}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})$/;

  let teamCache: { [key: string]: string } = {};

  const inviteUsers: inviteUsersFn = async (
    role,
    reinvite = false,
    take = 20,
    skip = 0,
  ) => {
    const query: Query = {
      skip,
      take,
      sort: [{ path: 'created', order: 'descending' }],
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

      const authConnections = connections.filter(
        (c) => !c.code.match(uuidMatch),
      );
      if (reinvite && authConnections.length === 0) {
        return true;
      }

      return false;
    });

    const userTeamIds = usersToInvite
      .flatMap((user) => user.data.teams.iv)
      .flatMap((team) => team?.id)
      .filter((team) => team && !teamCache[team]) // don't fetch teams on the cache
      .filter((team, pos, self) => self.indexOf(team) == pos) as string[]; // remove duplicate teams

    if (userTeamIds.length > 0) {
      const teamQuery: Query = {
        skip: 0,
        take: 20, // Dont expect a user to have more than 20 teams
        filter: {
          path: 'id',
          op: 'in',
          value: userTeamIds,
        },
      };

      const [teamsError, res] = await Intercept(teamClient.fetch(teamQuery));
      const fetchTeamError = teamsError as HTTPError;
      if (fetchTeamError) {
        log({
          op: 'Fetch teams',
          message: fetchTeamError.message,
          statusCode: fetchTeamError.response?.statusCode,
          body: fetchTeamError.response?.body,
        });
        throw fetchTeamError;
      }

      const { items: teams } = res;
      // Add teams to cache
      teams.forEach((team) => {
        teamCache[team.id] = team.data.displayName.iv;
      });
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
          log(`Created invite code for ${user.data.email.iv}`);
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
            log({
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
          let userTeams = '';
          if (teamCache) {
            userTeams = (user.data.teams.iv || [])
              .flatMap((team) => team.id)
              .map((id) => teamCache[id])
              .filter(Boolean)
              .join(' | ');
          }
          const teamReport = userTeams.length ? `(${userTeams})` : '';
          log(`Invited user ${user.data.email.iv} ${teamReport}`);
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
      log('Found no more uninvited users');
      return;
    }

    await inviteUsers(role, reinvite, take, skip + take);
  };

  return inviteUsers;
};

export default inviteUsersFactory;
