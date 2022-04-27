/* eslint-disable no-param-reassign */

import Intercept from 'apr-intercept';
import {
  RestTeam,
  RestUser,
  SquidexRest,
  UserTeamConnection,
} from '@asap-hub/squidex';
import { GenericError } from '@asap-hub/errors';
import { HTTPError } from 'got';
import { Data } from './parse';
import log from '../../logger';

const teams = new SquidexRest<RestTeam>('teams');
const users = new SquidexRest<RestUser>('users');

interface Cache {
  [key: string]: Promise<RestTeam | RestUser>;
}

const insertMembership = (
  user: RestUser,
  team: RestTeam,
  data: Data,
): Promise<RestUser> => {
  const newTeam: UserTeamConnection<string> = {
    id: [team.id],
    role: data.role,
  };

  return users.patch(user.id, {
    email: {
      iv: user.data.email.iv,
    },
    teams: {
      iv: [newTeam, ...(user.data.teams?.iv || [])].filter(
        (value, index, self) =>
          self.findIndex((v) => v.id[0] === value.id[0]) === index,
      ),
    },
  });
};

const insertTeam = async (data: Data, cache: Cache): Promise<RestTeam> => {
  const { application, lastName, projectTitle, role } = data;

  const team = {
    displayName: {
      iv: lastName,
    },
    applicationNumber: {
      iv: application,
    },
    projectTitle: {
      iv: projectTitle,
    },
    expertiseAndResourceTags: {
      iv: [],
    },
  };

  if (
    Object.prototype.hasOwnProperty.call(cache, team.applicationNumber.iv) &&
    role === 'Lead PI (Core Leadership)'
  ) {
    const t = await cache[team.applicationNumber.iv];
    cache[team.applicationNumber.iv] = teams.patch(t.id, {
      ...t,
      displayName: {
        iv: lastName,
      },
    });
  }

  if (!cache[team.displayName.iv]) {
    cache[team.applicationNumber.iv] = teams.create(team).catch((err) => {
      if (
        err.response?.statusCode === 400 &&
        err.response?.body?.includes('applicationNumber')
      ) {
        return teams.fetchOne({
          filter: {
            op: 'eq',
            path: 'data.applicationNumber.iv',
            value: team.applicationNumber.iv,
          },
        });
      }

      throw err;
    });
  }

  return cache[team.applicationNumber.iv] as Promise<RestTeam>;
};

const insertUser = async (
  data: Data,
  cache: Cache,
  upsert: boolean,
): Promise<RestUser> => {
  const {
    email,
    firstName,
    lastName,
    degree,
    jobTitle,
    expertiseAndResourceTags,
    questions,
    institution,
    orcid,
    biography,
    expertiseAndResourceDescription,
    asapRole,
    social,
    researchInterest,
    responsibilities,
  } = data;

  const user: RestUser['data'] = {
    avatar: {
      iv: [],
    },
    email: {
      iv: email,
    },
    firstName: {
      iv: firstName,
    },
    lastName: {
      iv: lastName,
    },
    jobTitle: {
      iv: jobTitle,
    },
    institution: {
      iv: institution,
    },
    expertiseAndResourceDescription: {
      iv: expertiseAndResourceDescription,
    },
    biography: {
      iv: biography,
    },
    expertiseAndResourceTags: {
      iv: expertiseAndResourceTags,
    },
    questions: {
      iv: questions.map((q) => ({
        question: q,
      })),
    },
    teams: {
      iv: [],
    },
    connections: {
      iv: [],
    },
    social: {
      iv: [social],
    },
    role: {
      iv: asapRole,
    },
    onboarded: {
      iv: true,
    },
    labs: {
      iv: [],
    },
    researchInterests: {
      iv: researchInterest,
    },
    responsibilities: {
      iv: responsibilities,
    },
  };

  if (orcid) {
    user.orcid = {
      iv: orcid,
    };
  }

  if (degree) {
    user.degree = {
      iv: degree,
    };
  }

  if (!cache[user.email.iv]) {
    cache[user.email.iv] = users.create(user).catch((err) => {
      if (err instanceof GenericError) {
        log(`fetch ${user.email.iv}`);
        return users
          .fetchOne({
            filter: {
              op: 'eq',
              path: 'data.email.iv',
              value: user.email.iv,
            },
          })
          .then((t) => {
            if (upsert) {
              log(`upsert ${user.email.iv}`);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { teams: _, connections, avatar, ...props } = user;
              return users.patch(t.id, {
                ...props,
              });
            }
            return t;
          });
      }

      throw err;
    });
  }

  return cache[user.email.iv] as Promise<RestUser>;
};

export default ({
    upsert,
  }: {
    upsert: boolean;
  }): ((data: Data) => Promise<void>) =>
  async (data: Data): Promise<void> => {
    const promises: Cache = {};
    const [e1, user] = await Intercept(insertUser(data, promises, upsert));
    const err1 = e1 as HTTPError;
    if (err1) {
      log({
        op: `create '${data.email}'`,
        message: err1.message,
        body: err1.response?.body,
      });
    }

    if (data.application) {
      const [e2, team] = await Intercept(insertTeam(data, promises));
      const err2 = e2 as HTTPError;
      if (err2) {
        log({
          op: `create '${data.application}'`,
          message: err1.message,
          body: err1.response?.body,
        });
      }

      const [e3] = await Intercept(insertMembership(user, team, data));
      const err3 = e3 as HTTPError;
      if (err3) {
        log({
          op: `update '${data.email}'`,
          message: err3.message,
          body: err3.response?.body,
        });
      }
    }
  };
