import Boom from '@hapi/boom';
import Debug from 'debug';
import path from 'path';
import url from 'url';
import Intercept from 'apr-intercept';
import get from 'lodash.get';

import { Invitee, UserResponse } from '@asap-hub/model';

import { CMS } from '../cms';
import * as auth0 from '../entities/auth0';
import { CMSUser, CMSOrcidWork } from '../entities/user';
import { sendEmail } from '../utils/send-mail';
import { origin } from '../config';
import { fetchOrcidProfile, ORCIDWorksResponse } from '../utils/fetch-orcid';

function transform(user: CMSUser): UserResponse {
  return {
    id: user.id,
    displayName: user.data.displayName.iv,
    email: user.data.email.iv,
    firstName: user.data.firstName?.iv,
    middleName: user.data.middleName?.iv,
    lastName: user.data.lastName?.iv,
    jobTitle: user.data.jobTitle?.iv,
    institution: user.data.institution?.iv,
    teams: user.data.teams?.iv,
    orcid: user.data.orcid?.iv,
    orcidLastModifiedDate: user.data.orcidLastModifiedDate?.iv,
    orcidWorks: user.data.orcidWorks?.iv,
  };
}

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

const debug = Debug('users.create');
export default class Users {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async create(user: Invitee): Promise<UserResponse> {
    let createdUser;
    try {
      createdUser = await this.cms.users.create(user);
    } catch (e) {
      throw Boom.conflict('Duplicate');
    }

    const [{ code }] = createdUser.data.connections.iv;
    const link = new url.URL(path.join(`/welcome/${code}`), origin);

    const [err] = await Intercept(
      sendEmail({
        to: [user.email],
        template: 'Welcome',
        values: {
          firstName: user.displayName,
          link: link.toString(),
        },
      }),
    );

    // istanbul ignore if
    if (err) {
      debug(err);
    }

    return transform(createdUser);
  }

  async fetch(): Promise<UserResponse[]> {
    const users = await this.cms.users.fetch();
    return users.length ? users.map(transform) : [];
  }

  async fetchById(id: string): Promise<UserResponse> {
    let user;
    try {
      user = await this.cms.users.fetchById(id);
    } catch (err) {
      throw Boom.notFound();
    }
    return transform(user);
  }

  async fetchByCode(code: string): Promise<UserResponse> {
    const user = await this.cms.users.fetchByCode(code);
    if (!user) {
      throw Boom.forbidden();
    }
    return transform(user);
  }

  async connectByCode(
    code: string,
    profile: auth0.UserInfo,
  ): Promise<UserResponse> {
    const user = await this.cms.users.fetchByCode(code);
    if (!user) {
      throw Boom.forbidden();
    }
    return transform(
      await this.cms.users.connectByCode(user, {
        id: profile.sub,
        source: 'auth0',
        raw: profile,
      }),
    );
  }

  async syncOrcidProfile(id: string): Promise<UserResponse> {
    const [notFound, user] = await Intercept(this.cms.users.fetchById(id));

    if (notFound) {
      throw Boom.notFound();
    }

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
      return transform(
        await this.cms.users.updateOrcidWorks(user, lastModifiedDate, works),
      );
    }

    return transform(user);
  }
}
