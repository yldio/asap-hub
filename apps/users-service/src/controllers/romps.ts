import { Romp } from '@asap-hub/model';
import { CMS } from '../cms';
import { CMSRomp } from '../entities/romps';

function transform(romp: CMSRomp): Romp {
  return {
    id: romp.id,
    created: romp.created,
    url: romp.data.url && romp.data.url.iv,
    doi: romp.data.doi && romp.data.doi.iv,
    outputType: romp.data.outputType && romp.data.outputType.iv,
    title: romp.data.title && romp.data.title.iv,
    description: romp.data.description && romp.data.description.iv,
    authors: romp.data.authors && romp.data.authors.iv,
    publishDate: romp.data.publishDate && romp.data.publishDate.iv,
    createdBy: romp.data.createdBy && romp.data.createdBy.iv,
  } as Romp;
}

export default class Romps {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async create(id: string, romp: Romp): Promise<Romp> {
    const createdRomp = await this.cms.romps.create(id, romp);
    return transform(createdRomp);
  }
}
