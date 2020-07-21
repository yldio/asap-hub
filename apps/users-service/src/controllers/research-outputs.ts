import {
  ResearchOutputResponse,
  ResearchOutputCreationRequest,
} from '@asap-hub/model';
import get from 'lodash.get';

import { CMS } from '../cms';
import { CMSResearchOutput } from '../entities/research-outputs';

function transform(output: CMSResearchOutput): ResearchOutputResponse {
  return {
    id: output.id,
    created: output.created,
    url: get(output, 'data.url.iv', null),
    doi: get(output, 'data.doi.iv', null),
    type: get(output, 'data.type.iv', null),
    title: get(output, 'data.title.iv', null),
    description: get(output, 'data.description.iv', null),
    accessLevel: get(output, 'data.accessLevel.iv', null),
    authors: get(output, 'data.authors.iv', []).map(
      (author: { id: string[]; displayName: string }) => ({
        id: get(author, 'id[0]', null),
        displayName: get(author, 'displayName', null),
      }),
    ),
    publishDate: get(output, 'data.publishDate.iv', null),
    createdBy: {
      id: get(output, 'data.createdBy.iv[0].id[0]', null),
      displayName: get(output, 'data.createdBy.iv[0].displayName', null),
    },
  } as ResearchOutputResponse;
}

export default class ResearchOutputs {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
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

  async fetchUserResearchOutputs(
    id: string,
  ): Promise<ResearchOutputResponse[]> {
    const outputs = await this.cms.researchOutputs.fetchUserResearchOutputs(id);
    return outputs.length ? outputs.map(transform) : [];
  }
}
