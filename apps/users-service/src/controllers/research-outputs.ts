import { ResearchOutput } from '@asap-hub/model';
import { CMS } from '../cms';
import { CMSResearchOutput } from '../entities/research-outputs';

function transform(output: CMSResearchOutput): ResearchOutput {
  return {
    id: output.id,
    created: output.created,
    url: output.data.url && output.data.url.iv,
    doi: output.data.doi && output.data.doi.iv,
    outputType: output.data.outputType && output.data.outputType.iv,
    title: output.data.title && output.data.title.iv,
    description: output.data.description && output.data.description.iv,
    authors: output.data.authors && output.data.authors.iv,
    publishDate: output.data.publishDate && output.data.publishDate.iv,
    createdBy: {
      id: output.data.createdBy && output.data.createdBy.iv.id,
      name: output.data.createdBy && output.data.createdBy.iv.name,
    },
  } as ResearchOutput;
}

export default class ResearchOutputs {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async create(
    id: string,
    name: string,
    output: ResearchOutput,
  ): Promise<ResearchOutput> {
    const createdOutput = await this.cms.researchOutputs.create(
      id,
      name,
      output,
    );
    return transform(createdOutput);
  }

  async fetchUserResearchOutputs(id: string): Promise<ResearchOutput[]> {
    const outputs = await this.cms.researchOutputs.fetchUserResearchOutputs(id);
    return outputs.length ? outputs.map(transform) : [];
  }
}
