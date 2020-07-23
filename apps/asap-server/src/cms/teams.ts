import { Base, BaseOptions } from '@asap-hub/services-common';
import { CMSTeam } from '../entities/team';

export default class Teams extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  async fetchById(id: string): Promise<CMSTeam> {
    return this.client.get<CMSTeam>(`teams/${id}`).json();
  }
}
