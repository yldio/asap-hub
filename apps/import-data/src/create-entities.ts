import Intercept from 'apr-intercept';
import { Squidex } from '@asap-hub/services-common';
import { Data } from './parse-data';

const teams = new Squidex<{
  id: string;
  data: {
    displayName: { iv: string };
    applicationNumber: { iv: string };
    projectTitle: { iv: string };
  };
}>('teams');
const users = new Squidex('users');

interface HTTPError extends Error {
  response?: {
    statusCode: number;
    body: string;
  };
}

interface User {
  email: string;
  displayName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  institution: string;
  degree: string;
  jobTitle: string;
  orcid: string;
  teams: [
    {
      id: string[];
      displayName: string;
      role: string;
    },
  ];
}

const createUser = (user: User) => {
  return users.create({
    email: {
      iv: user.email,
    },
    displayName: {
      iv: `${user.firstName} ${user.lastName}`,
    },
    firstName: {
      iv: user.firstName,
    },
    middleName: {
      iv: user.middleName,
    },
    lastName: {
      iv: user.lastName,
    },
    institution: {
      iv: user.institution,
    },
    degree: {
      iv: user.degree,
    },
    jobTitle: {
      iv: user.jobTitle,
    },
    orcid: {
      iv: user.orcid,
    },
    teams: {
      iv: user.teams,
    },
  });
};

const updateUserTeams = (
  user: { id: string; data: { teams: { iv: User['teams'] } } },
  team: {
    id: string[];
    displayName: string;
    role: string;
  },
) => {
  return users.patch(user.id, {
    ...user.data,
    teams: {
      iv: [...user.data.teams.iv, team].filter(
        (team, index, self) =>
          self.findIndex((t) => t.id[0] === team.id[0]) === index,
      ),
    },
  });
};

export default () => {
  const promises: {
    [key: string]: Promise<{
      id: string;
      data: { displayName: { iv: string } };
    }>;
  } = {};

  return async (data: Data) => {
    const {
      applicationNumber,
      projectTitle,
      firstName,
      middleName,
      lastName,
      role,
      institution,
      degree,
      jobTitle,
      email,
      orcid,
    } = data;

    if (!promises[applicationNumber]) {
      promises[applicationNumber] = teams
        .create({
          displayName: {
            iv: `${lastName}, ${firstName[0]}`,
          },
          applicationNumber: {
            iv: applicationNumber,
          },
          projectTitle: {
            iv: projectTitle,
          },
        })
        .catch((err) => {
          if (
            err.response?.statusCode === 400 &&
            err.response?.body?.includes('applicationNumber')
          ) {
            return teams.fetchOne({
              filter: {
                op: 'eq',
                path: 'data.applicationNumber.iv',
                value: applicationNumber,
              },
            });
          }

          throw err;
        });
    }

    const [e1, team] = await Intercept(promises[applicationNumber]);
    const err1 = e1 as HTTPError;
    if (err1) {
      console.error({
        op: `create '${applicationNumber}'`,
        message: err1.message,
        statusCode: err1.response?.statusCode,
        body: err1.response?.body,
      });
      return;
    }

    const [e2] = await Intercept(
      createUser({
        email,
        displayName: `${firstName} ${lastName}`,
        firstName,
        middleName,
        lastName,
        institution,
        degree,
        jobTitle,
        orcid,
        teams: [
          {
            id: [team.id],
            displayName: team.data.displayName.iv,
            role,
          },
        ],
      }),
    );
    const err2 = e2 as HTTPError;
    if (err2) {
      console.error({
        op: `create '${email}'`,
        message: err2.message,
        body: err2.response?.body,
      });
    }

    if (err2 && err2.response?.statusCode === 400) {
      const user = (await users.fetchOne({
        filter: {
          op: 'eq',
          path: 'data.email.iv',
          value: email,
        },
      })) as {
        id: string;
        data: {
          teams: {
            iv: User['teams'];
          };
        };
      };

      const [e3] = await Intercept(
        updateUserTeams(user, {
          id: [team.id],
          displayName: team.data.displayName.iv,
          role,
        }),
      );

      const err3 = e3 as HTTPError;
      if (err3) {
        console.error({
          op: `update '${email}'`,
          message: err3.message,
          body: err3.response?.body,
        });
      }
    }
  };
};
