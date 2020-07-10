import { CMS } from '../cms';
import { CreateRomp } from '../cms/romps';
import { Romp } from '../entities/romps';

export interface ReplyRomp {
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
  publishingDate: string;
  creator: string;
}

function transform(romp: Romp): ReplyRomp {
  const data = Object.keys(romp.data).reduce((flat, key) => {
    flat[key] = romp.data[key].iv;
    return flat;
  }, {});

  return {
    id: romp.id,
    created: romp.created,
    ...data,
  } as ReplyRomp;
}

export default class Romps {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async create(id: string, romp: CreateRomp): Promise<ReplyRomp> {
    const createdRomp = await this.cms.romps.create(id, romp);
    return transform(createdRomp);
  }
}
