import {
  ResearchOutputResponse,
  ResearchOutputCreationRequest,
} from '@asap-hub/model';
import { Squidex } from '@asap-hub/services-common';

import { CMS } from '../cms';
import { CMSResearchOutput } from '../entities/research-outputs';

function transform(output: CMSResearchOutput): ResearchOutputResponse {
  return {
    id: output.id,
    created: output.created,
    url: output.data.url?.iv || '',
    doi: output.data.doi?.iv || '',
    type: output.data.type.iv,
    title: output.data.title.iv,
    text: output.data.text?.iv || '',
    publishDate: output.data.publishDate?.iv,
  } as ResearchOutputResponse;
}

export default class ResearchOutputs {
  cms: CMS;

  researchOutputs: Squidex<CMSResearchOutput>;

  constructor() {
    this.cms = new CMS();
    this.researchOutputs = new Squidex('research-outputs');
  }

  async create(
    id: string,
    name: string,
    output: ResearchOutputCreationRequest,
  ): Promise<ResearchOutputResponse> {
    const createdOutput = await this.cms.researchOutputs.create(
      id,
      name,
      output,
    );
    return transform(createdOutput);
  }

  async fetchById(id: string): Promise<ResearchOutputResponse> {
    const res = await this.researchOutputs.fetchById(id);
    return transform(res);
  }

  async fetch(): Promise<ResearchOutputResponse[]> {
    const res = await this.researchOutputs.fetch();
    return res.items.map(transform);
  }
}
