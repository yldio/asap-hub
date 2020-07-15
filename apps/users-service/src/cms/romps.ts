import { Base, BaseOptions } from '@asap-hub/services-common';
import { Romp } from '../entities/romps';

export interface CreateRomp {
  id: string;
  created: string;
  url: string;
  doi: string;
  outputType: string;
  title: string;
  description: string;
  authors: [
    {
      name: string;
      id: string;
    },
  ];
  publishDate: string;
}

export default class Users extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  create(id: string, romp: CreateRomp): Promise<Romp> {
    return this.client
      .post<Romp>('romp', {
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
