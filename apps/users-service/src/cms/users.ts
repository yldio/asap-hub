import { v4 as uuidV4 } from 'uuid';
import { Base, BaseOptions } from '@asap-hub/services-common';
import { User } from '../entities/user';

export interface Connection {
  id: string;
  raw: unknown;
  source: string;
}

export interface CreateUser {
  displayName: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  title: string;
  orcid: string;
  institution: string;
}

export default class Users extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  create(user: CreateUser): Promise<User> {
    const code = uuidV4();
    return this.client
      .post<User>('users', {
        json: {
          displayName: { iv: user.displayName },
          email: { iv: user.email },
          firstName: { iv: user.firstName },
          middleName: { iv: user.middleName },
          lastName: { iv: user.lastName },
          title: { iv: user.title },
          orcid: { iv: user.orcid },
          institution: { iv: user.institution },
          connections: { iv: [{ code }] },
        },
        searchParams: { publish: true },
      })
      .json();
  }

  async fetch(): Promise<User[]> {
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

  async fetchByEmail(email: string): Promise<User | null> {
    const { items } = await this.client
      .get('users', {
        searchParams: { $filter: `data/email/iv eq '${email}'` },
      })
      .json();

    return items[0] as User;
  }

  async fetchById(id: string): Promise<User> {
    return this.client.get<User>(`users/${id}`).json();
  }

  async fetchByCode(code: string): Promise<User | null> {
    const { items } = await this.client
      .get('users', {
        searchParams: { $filter: `data/connections/iv/code eq '${code}'` },
      })
      .json();

    return items.length ? (items[0] as User) : null;
  }

  connectByCode(user: User, profile: Connection): Promise<User> {
    const connections = user.data.connections.iv.concat([{ code: profile.id }]);
    return this.client
      .patch<User>(`users/${user.id}`, {
        json: {
          email: { iv: user.data.email.iv },
          connections: { iv: connections },
        },
      })
      .json();
  }
}
