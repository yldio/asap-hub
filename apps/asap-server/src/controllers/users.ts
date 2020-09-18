import Boom from '@hapi/boom';
import path from 'path';
import url from 'url';
import Intercept from 'apr-intercept';
import get from 'lodash.get';
import { Got } from 'got';
import { v4 as uuidV4 } from 'uuid';
import { Squidex } from '@asap-hub/services-common';
import { Invitee, UserResponse, ListUserResponse } from '@asap-hub/model';

import { CMSUser, CMSOrcidWork } from '../entities/user';
import { sendEmail } from '../utils/send-mail';
import { origin, environment } from '../config';
import { fetchOrcidProfile, ORCIDWorksResponse } from '../utils/fetch-orcid';
import { createURL } from '../utils/squidex';

export const transform = (user: CMSUser): UserResponse => {
  return JSON.parse(
    JSON.stringify({
      id: user.id,
      createdDate: user.created,
      lastModifiedDate: user.data.lastModifiedDate?.iv,
      displayName: user.data.displayName.iv,
      email: user.data.email.iv,
      firstName: user.data.firstName?.iv,
      middleName: user.data.middleName?.iv,
      lastName: user.data.lastName?.iv,
      biography: user.data.biography?.iv,
      jobTitle: user.data.jobTitle?.iv,
      institution: user.data.institution?.iv,
      teams:
        user.data.teams?.iv.map(({ id, ...t }) => ({ id: id[0], ...t })) || [],
      location: user.data.location?.iv,
      orcid: user.data.orcid?.iv,
      orcidLastSyncDate: user.data.orcidLastSyncDate?.iv,
      orcidLastModifiedDate: user.data.orcidLastModifiedDate?.iv,
      orcidWorks: user.data.orcidWorks?.iv,
      skills: user.data.skills?.iv || [],
      questions: user.data.questions?.iv.map(({ question }) => question) || [],
      avatarURL: user.data.avatar && createURL(user.data.avatar.iv)[0],
    }),
  );
};

function transformOrcidWorks(
  orcidWorks: ORCIDWorksResponse,
): { lastModifiedDate: string; works: CMSOrcidWork[] } {
  // parse & stringify to remove undefined values
  return {
    lastModifiedDate: `${orcidWorks['last-modified-date']?.value}`,
    works: orcidWorks.group.map((work) =>
      JSON.parse(
        JSON.stringify({
          doi: get(work, 'external-ids.external-id[0].external-id-url.value'),
          id: `${work['work-summary'][0]['put-code']}`,
          title: get(work, '["work-summary"][0].title.title.value'),
          type: get(work, '["work-summary"][0].type'),
          publicationDate: {
            year: get(
              work,
              '["work-summary"][0]["publication-date"].year.value',
            ),
            month: get(
              work,
              '["work-summary"][0]["publication-date"].month.value',
            ),
            day: get(work, '["work-summary"][0]["publication-date"].day.value'),
          },
          lastModifiedDate: `${work['last-modified-date'].value}`,
        }),
      ),
    ),
  };
}

const fetchByCode = async (code: string, client: Got): Promise<CMSUser> => {
  const [err, res] = await Intercept(
    client
      .get('users', {
        searchParams: {
          $top: 1,
          $filter: `data/connections/iv/code eq '${code}'`,
        },
      })
      .json() as Promise<{ items: CMSUser[] }>,
  );

  if (err) {
    throw Boom.forbidden();
  }

  if (res.items.length === 0) {
    throw Boom.forbidden();
  }

  return res.items[0];
};

export default class Users {
  users: Squidex<CMSUser>;

  constructor() {
    this.users = new Squidex('users');
  }

  async create(user: Invitee): Promise<UserResponse> {
    // remove undefined(s)
    const userData: CMSUser['data'] = JSON.parse(
      JSON.stringify({
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
      }),
    );

    const createdUser = await this.users.create(userData);

    return transform(createdUser);
  }

  async fetch(options: {
    take: number;
    skip: number;
    search?: string;
    filter?: string | string[];
  }): Promise<ListUserResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { search, filter, ...opts } = options;

    const { total, items: users } = await this.users.fetch({
      ...opts,
      ...(search
        ? {
            fullText: search,
            filter: {
              or: search.split(' ').flatMap((word) => [
                { path: 'data.displayName.iv', op: 'contains', value: word },
                { path: 'data.firstName.iv', op: 'contains', value: word },
                { path: 'data.lastName.iv', op: 'contains', value: word },
              ]),
            },
          }
        : {}),
      sort: [{ path: 'data.displayName.iv' }],
    });

    return {
      total,
      items: users.map(transform),
    };
  }

  async fetchById(id: string): Promise<UserResponse> {
    return transform(await this.users.fetchById(id));
  }

  async fetchByCode(code: string): Promise<UserResponse> {
    const user = await fetchByCode(code, this.users.client);
    return transform(user);
  }

  async syncOrcidProfile(
    id: string,
    cachedUser: CMSUser | undefined = undefined,
  ): Promise<UserResponse> {
    let fetchedUser;
    if (!cachedUser) {
      fetchedUser = await this.users.fetchById(id);
    }

    const user = cachedUser || (fetchedUser as CMSUser);

    const [error, res] = await Intercept(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fetchOrcidProfile(user!.data.orcid!.iv),
    );

    if (error) {
      throw Boom.badGateway();
    }

    const { lastModifiedDate, works } = transformOrcidWorks(res);

    if (
      !user.data.orcidLastModifiedDate?.iv ||
      user.data.orcidLastModifiedDate.iv < lastModifiedDate
    ) {
      const updatedUser = await this.users.patch(user.id, {
        email: { iv: user.data.email.iv },
        orcidLastSyncDate: { iv: `${new Date().toISOString()}` },
        orcidLastModifiedDate: { iv: lastModifiedDate },
        orcidWorks: { iv: works.slice(0, 10) },
      });
      return transform(updatedUser);
    }

    return transform(user);
  }

  async connectByCode(user: CMSUser, userId: string): Promise<UserResponse> {
    const connections = user.data.connections?.iv || [];

    // dont add the same code twice
    if (connections.find(({ code }) => code === userId)) {
      return Promise.resolve(transform(user));
    }

    const res = await this.users.patch(user.id, {
      email: { iv: user.data.email.iv },
      connections: {
        iv: connections
          .filter(({ code }) => !code.startsWith('ASAP|')) // remove asap codes
          .concat([{ code: userId }]),
      },
    });

    return transform(res);
  }

  async sendWelcomeEmail(userId: CMSUser['id']): Promise<void | Error> {
    const code = uuidV4();

    const user = await this.users.fetchById(userId);
    const connections = user.data.connections?.iv;

    if (connections?.length) {
      // user already received email, skip
      return Promise.resolve();
    }

    await this.connectByCode(user, `ASAP|${code}`);

    const email =
      environment === 'production'
        ? user.data.email.iv
        : 'success@simulator.amazonses.com';

    const link = new url.URL(path.join(`/welcome/${code}`), origin);

    const [err2] = await Intercept(
      sendEmail({
        to: [email],
        template: 'Welcome',
        values: {
          firstName: user.data.displayName.iv,
          link: link.toString(),
        },
      }),
    );

    if (!err2) {
      return Promise.resolve();
    }

    // error sending mail, remove inserted code
    await this.users.patch(user.id, {
      email: { iv: user.data.email.iv },
      connections: { iv: [] },
    });

    return Promise.reject(err2);
  }
}
