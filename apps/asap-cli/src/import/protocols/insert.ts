/* eslint-disable no-console, no-param-reassign */

import Intercept from 'apr-intercept';
import {
  Squidex,
  RestUser,
  RestResearchOutput,
  RestTeam,
} from '@asap-hub/squidex';
import { DecisionOption, ResearchOutputSharingStatus } from '@asap-hub/model';
import { DateTime } from 'luxon';
import { HTTPError } from 'got';
import { Protocol } from './parse';
import log from '../../logger';

const users = new Squidex<RestUser>('users', { unpublished: true });
const teams = new Squidex<RestTeam>('teams', { unpublished: true });
const protocols = new Squidex<RestResearchOutput>('research-outputs', {
  unpublished: true,
});

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
        log(`❌ couldn't find a team with the name "${name}".`);
        return null;
      });
  }

  const user = await cache[name];
  if (user && user.data.teams.iv) {
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

const addProtocolToTeam = async (
  teamId: string,
  protocolId: string,
): Promise<RestTeam> =>
  teams.fetchById(teamId).then((team) => {
    const json = {
      outputs: {
        iv: [protocolId, ...(team.data.outputs?.iv || [])].filter(
          (value, index, self) => self.findIndex((v) => v === value) === index,
        ),
      },
    };
    return teams.patch(team.id, json);
  });

export default async (data: Protocol): Promise<void> => {
  const promises: Cache = {};
  const protocol: RestResearchOutput['data'] = {
    type: { iv: 'Protocol' },
    title: { iv: data.name },
    link: { iv: data.link },
    publishDate: { iv: new Date(data.created).toISOString() },
    addedDate: { iv: DateTime.utc().toISO() },
    description: {
      // eslint-disable-next-line prefer-template
      iv: `${data.abstract ? data.abstract + '\n || ' : ''}From Team ${
        data.team
      } || Authors: ${data.authors.join(', ')}.`,
    },
    tags: { iv: data.keywords },
    sharingStatus: { iv: 'Network Only' as ResearchOutputSharingStatus },
    asapFunded: { iv: 'Not Sure' as DecisionOption },
    usedInAPublication: { iv: 'Not Sure' as DecisionOption },
  };

  const [e1, teamId] = await Intercept(fetchTeamByName(data.team, promises));
  const [e2, current] = await Intercept(fetchProtocolByLink(data.link));

  const err1 = e1 as HTTPError;
  if (err1) {
    log({
      op: `❌ fetch team '${data.team}'`,
      message: err1.message,
      body: err1.response?.body,
    });
  }

  const err2 = e2 as HTTPError;
  if (err2) {
    log({
      op: `❌ fetch protocol '${data.link}'`,
      message: err2.message,
      body: err2.response?.body,
    });
  }

  let protocolId = current?.id;
  if (current) {
    await protocols.patch(current.id, protocol);
  } else {
    const [e3, res] = await Intercept(protocols.create(protocol, false));
    const err3 = e3 as HTTPError;
    if (err3) {
      log({
        op: `❌ create '${data.link}'`,
        message: err3.message,
        body: err3.response?.body,
      });
    }
    protocolId = res.id;
  }

  if (teamId && protocolId) {
    const [e4] = await Intercept(addProtocolToTeam(teamId, protocolId));
    const err4 = e4 as HTTPError;
    if (err4) {
      log({
        op: `link '${protocolId}' and '${teamId}'`,
        message: err4.message,
        body: err4.response?.body,
      });
    }
  }
};
