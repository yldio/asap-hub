import { Base, BaseOptions } from '@asap-hub/services-common';
import { CMSUser } from '../entities/user';

export default class Users extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  async fetchByTeam(id: string): Promise<CMSUser[]> {
    const { items } = await this.client
      .get('users', {
        searchParams: { $filter: `data/teams/iv/id eq '${id}'` },
      })
      .json();
    return items;
  }
}
