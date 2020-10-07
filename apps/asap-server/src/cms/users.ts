import { v4 as uuidV4 } from 'uuid';
import { Base, BaseOptions } from '@asap-hub/services-common';
import { Invitee } from '@asap-hub/model';
import get from 'lodash.get';

import { CMSUser } from '../entities/user';
import { CMSTeam } from '../entities/team';

interface CreateUserData {
  lastModifiedDate: { iv: string };
  displayName: { iv: string };
  email: { iv: string };
  firstName: { iv?: string };
  middleName: { iv?: string };
  lastName: { iv?: string };
  jobTitle: { iv?: string };
  orcid: { iv?: string };
  institution: { iv?: string };
  connections?: { iv: { code: string }[] };
  location: { iv?: string };
  avatarURL: { iv?: string };
}

export default class Users extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  create(user: Invitee, options: { raw?: boolean } = {}): Promise<CMSUser> {
    const json: CreateUserData = {
      lastModifiedDate: { iv: `${new Date().toISOString()}` },
      displayName: { iv: user.displayName },
      email: { iv: user.email },
      firstName: { iv: user.firstName },
      middleName: { iv: user.middleName },
      lastName: { iv: user.lastName },
      jobTitle: { iv: user.jobTitle },
      orcid: { iv: user.orcid },
      institution: { iv: user.institution },
      location: { iv: user.location },
      avatarURL: { iv: user.avatarURL },
    };

    if (!options?.raw) {
      json.connections = { iv: [{ code: uuidV4() }] };
    }

    return this.client
      .post<CMSUser>('users', { json, searchParams: { publish: true } })
      .json();
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
}
