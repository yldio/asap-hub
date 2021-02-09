/* eslint-disable no-console, no-param-reassign */

import Intercept from 'apr-intercept';
import { Squidex, RestUser, RestResearchOutput } from '@asap-hub/squidex';
import { Protocol } from './parse';

const users = new Squidex<RestUser>('users');
const protocols = new Squidex<RestResearchOutput>('research-outputs');
interface Cache {
  [key: string]: Promise<RestUser | null>;
}

const fetchTeamByName = async (
  name: string,
  cache: Cache,
): Promise<string | null> => {
  if (!cache[name]) {
    cache[name] = users
      .fetchOne({
        filter: {
          op: 'eq',
          path: 'data.lastName.iv',
          value: name,
        },
      })
      .catch(() => {
        console.log(`❌ couldn't find a team with the name "${name}".`);
        return null;
      });
  }

  const user = await cache[name];
  if (user) {
    const userTeamsLeadership = user.data.teams.iv.find(
      (t) => t.role === 'Lead PI (Core Leadership)',
    );
    return userTeamsLeadership?.id[0] ?? null;
  }

  return null;
};

const fetchProtocolByLink = async (
  link: string,
): Promise<RestResearchOutput | null> =>
  protocols
    .fetchOne({
      filter: {
        op: 'eq',
        path: 'data.link.iv',
        value: link,
      },
    })
    .catch(() => null);

export default async (data: Protocol): Promise<void> => {
  const promises: Cache = {};
  const protocol: RestResearchOutput['data'] = {
    type: { iv: 'Protocol' },
    title: {
      iv: data.name,
    },
    shortText: {
      iv:
        data.abstract ||
        `From Team ${data.team} and authors: ${data.authors.join(', ')}`,
    },
    link: {
      iv: data.link,
    },
    publishDate: {
      iv: new Date(data.created).toISOString(),
    },
    text: {
      iv: `From Team ${data.team} and authors: ${data.authors.join(
        ', ',
      )}. Keywords: neutrophil, isolation, neutrophil isolation, whole blood`,
    },
    tags: {
      iv: data.keywords,
    },
  };

  const [, team] = await Intercept(fetchTeamByName(data.team, promises));
  const [, current] = await Intercept(fetchProtocolByLink(data.link));

  if (current) {
    await protocols.patch(current.id, protocol);
  } else {
    const res = await protocols.create(protocol, false);
    console.log(`assign protocol "${res.id}" to team "${team}"`);
  }
};
