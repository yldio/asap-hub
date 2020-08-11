import { v4 as uuidV4 } from 'uuid';
import { Base, BaseOptions } from '@asap-hub/services-common';
import { Invitee } from '@asap-hub/model';
import get from 'lodash.get';

import { CMSUser, CMSOrcidWork } from '../entities/user';
import { CMSTeam } from '../entities/team';

export interface Connection {
  id: string;
  raw: unknown;
  source: string;
}

interface createUserData {
  displayName: { iv: string };
  email: { iv: string };
  firstName: { iv?: string };
  middleName: { iv?: string };
  lastName: { iv?: string };
  jobTitle: { iv?: string };
  orcid: { iv?: string };
  institution: { iv?: string };
  connections?: { iv: { code: string }[] };
}

export default class Users extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  create(user: Invitee, options: { raw?: boolean } = {}): Promise<CMSUser> {
    const json: createUserData = {
      displayName: { iv: user.displayName },
      email: { iv: user.email },
      firstName: { iv: user.firstName },
      middleName: { iv: user.middleName },
      lastName: { iv: user.lastName },
      jobTitle: { iv: user.jobTitle },
      orcid: { iv: user.orcid },
      institution: { iv: user.institution },
    };

    if (!options?.raw) {
      json.connections = { iv: [{ code: uuidV4() }] };
    }

    return this.client
      .post<CMSUser>('users', { json, searchParams: { publish: true } })
      .json();
  }

  delete(id: string): Promise<void> {
    return this.client.delete(`users/${id}`).json();
  }

  async fetch(): Promise<CMSUser[]> {
    const { items } = await this.client
      .get('users', {
        searchParams: {
          q: JSON.stringify({
            take: 30,
            sort: [{ path: 'data.displayName.iv' }],
          }),
        },
      })
      .json();
    return items;
  }

  async fetchByEmail(email: string): Promise<CMSUser | null> {
    const { items } = await this.client
      .get('users', {
        searchParams: { $filter: `data/email/iv eq '${email}'` },
      })
      .json();

    return items[0] as CMSUser;
  }

  fetchById(id: string): Promise<CMSUser> {
    return this.client.get<CMSUser>(`users/${id}`).json();
  }

  async fetchByCode(code: string): Promise<CMSUser | null> {
    const { items } = await this.client
      .get('users', {
        searchParams: { $filter: `data/connections/iv/code eq '${code}'` },
      })
      .json();

    return items.length ? (items[0] as CMSUser) : null;
  }

  async fetchByTeam(id: string): Promise<CMSUser[]> {
    const { items } = await this.client
      .get('users', {
        searchParams: { $filter: `data/teams/iv/id eq '${id}'` },
      })
      .json();
    return items;
  }

  addToTeam(user: CMSUser, role: string, team: CMSTeam): Promise<CMSUser> {
    const teams = get(user, 'data.teams.iv', []).concat([
      {
        role,
        displayName: team.data.displayName.iv,
        id: [team.id],
      },
    ]);

    return this.client
      .patch<CMSUser>(`users/${user.id}`, {
        json: {
          email: { iv: user.data.email.iv },
          teams: { iv: teams },
        },
      })
      .json();
  }

  connectByCode(user: CMSUser, profile: Connection): Promise<CMSUser> {
    const connections = user.data.connections.iv.concat([{ code: profile.id }]);
    return this.client
      .patch<CMSUser>(`users/${user.id}`, {
        json: {
          email: { iv: user.data.email.iv },
          connections: { iv: connections },
        },
      })
      .json();
  }

  updateOrcidWorks(
    user: CMSUser,
    lastModifiedDate: string,
    works: CMSOrcidWork[],
  ): Promise<CMSUser> {
    return this.client
      .patch<CMSUser>(`users/${user.id}`, {
        json: {
          email: { iv: user.data.email.iv },
          orcidLastModifiedDate: { iv: lastModifiedDate },
          orcidWorks: { iv: works },
        },
      })
      .json();
  }
}
