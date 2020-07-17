import { Base, BaseOptions } from '@asap-hub/services-common';
import { Romp } from '@asap-hub/model';
import { CMSRomp } from '../entities/romps';

export default class Users extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  create(id: string, romp: Romp): Promise<CMSRomp> {
    return this.client
      .post<CMSRomp>('romp', {
        json: {
          url: { iv: romp.url },
          doi: { iv: romp.doi },
          authors: { iv: romp.authors },
          title: { iv: romp.title },
          description: { iv: romp.description },
          outputType: { iv: romp.outputType },
          publishDate: { iv: romp.publishDate },
          createdBy: { iv: id },
        },
        searchParams: { publish: true },
      })
      .json();
  }
}
