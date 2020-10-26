/* eslint-disable no-console, no-param-reassign */

import Intercept from 'apr-intercept';
import { Squidex } from '@asap-hub/services-common';
import { Data } from './parse-data';

const teams = new Squidex<Team>('teams');
const users = new Squidex<User>('users');

interface Cache {
  [key: string]: Promise<Team | User>;
}

interface HTTPError extends Error {
  response?: {
    statusCode: number;
    body: string;
  };
}

interface Team {
  id: string;
  data: {
    applicationNumber: { iv: string };
    displayName: { iv: string };
    projectTitle: { iv: string };
  };
}

interface User {
  id: string;
  data: {
    displayName: { iv: string };
    email: { iv: string };
    firstName: { iv: string };
    lastName: { iv: string };
    jobTitle?: { iv: string };
    degree?: { iv: string };
    institution?: { iv: string };
    biography?: { iv: string };
    location?: { iv: string };
    teams?: {
      iv: {
        id: string[];
        role: string;
        approach: string;
        responsabilities: string;
      }[];
    };
    orcid?: { iv: string };
    skills?: { iv: string[] };
    questions?: {
      iv: {
        question: string;
      }[];
    };
  };
}

const addTeamToUser = (user: User, team: Team, data: Data): Promise<object> => {
  const newTeam = {
    id: [team.id],
    role: data.role,
    approach: data.approach,
    responsabilities: data.researchInterest,
  };
  return users.patch(user.id, {
    ...user.data,
    teams: {
      iv: [...(user.data.teams?.iv || []), newTeam].filter(
        (value, index, self) =>
          self.findIndex((v) => v.id[0] === value.id[0]) === index,
      ),
    },
  });
};

const updateAndFetchTeam = async (data: Data, cache: Cache): Promise<Team> => {
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
  };

  if (cache[team.applicationNumber.iv] && role === 'Lead PI') {
    const t = await cache[team.applicationNumber.iv];
    cache[team.applicationNumber.iv] = teams.patch(t.id, team);
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

  return cache[team.applicationNumber.iv] as Promise<Team>;
};

const upsertAndFetchUser = async (data: Data, cache: Cache): Promise<User> => {
  const {
    email,
    firstName,
    lastName,
    degree,
    jobTitle,
    skills,
    questions,
    institution,
    orcid,
    biography,
    skillsDescription,
  } = data;

  const user = {
    email: {
      iv: email,
    },
    displayName: {
      iv: `${firstName} ${lastName}`,
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
    skillsDescription: {
      iv: skillsDescription,
    },
    biography: {
      iv: biography,
    },
    ...(degree
      ? {
          degree: {
            iv: degree,
          },
        }
      : {}),
    skills: {
      iv: skills,
    },
    questions: {
      iv: questions.map((q) => ({
        question: q,
      })),
    },
    ...(orcid
      ? {
          orcid: {
            iv: orcid,
          },
        }
      : {}),
  };

  if (!cache[user.email.iv]) {
    cache[user.email.iv] = users.create(user).catch((err) => {
      if (err.response?.statusCode === 400) {
        console.log(`fetch ${user.email.iv}`);
        return users
          .fetchOne({
            filter: {
              op: 'eq',
              path: 'data.email.iv',
              value: user.email.iv,
            },
          })
          .then((t) => {
            console.log(`upsert ${user.email.iv}`);
            return users.patch(t.id, user);
          });
      }

      throw err;
    });
  }

  return cache[user.email.iv] as Promise<User>;
};

export default (): ((data: Data) => Promise<void>) => {
  const promises: Cache = {};

  return async (data: Data): Promise<void> => {
    const [e1, user] = await Intercept(upsertAndFetchUser(data, promises));
    const err1 = e1 as HTTPError;
    if (err1) {
      console.error({
        op: `create '${data.email}'`,
        message: err1.message,
        body: err1.response?.body,
      });
    }

    if (data.application) {
      const [e2, team] = await Intercept(updateAndFetchTeam(data, promises));
      const err2 = e2 as HTTPError;
      if (err2) {
        console.error({
          op: `create '${data.application}'`,
          message: err1.message,
          statusCode: err1.response?.statusCode,
          body: err1.response?.body,
        });
        return;
      }

      const [e3] = await Intercept(addTeamToUser(user, team, data));
      const err3 = e3 as HTTPError;
      if (err3) {
        console.error({
          op: `update '${data.email}'`,
          message: err3.message,
          body: err3.response?.body,
        });
      }
    }
  };
};
