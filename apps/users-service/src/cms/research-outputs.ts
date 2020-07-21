import Intercept from 'apr-intercept';
import { Base, BaseOptions } from '@asap-hub/services-common';
import { ResearchOutput } from '@asap-hub/model';
import { CMSResearchOutput } from '../entities/research-outputs';

export default class Users extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  async create(
    id: string,
    displayName: string,
    output: ResearchOutput,
  ): Promise<CMSResearchOutput> {
    const [err, romp] = await Intercept(
      this.client
        .post<CMSResearchOutput>('research-outputs', {
          json: {
            url: { iv: output.url },
            doi: { iv: output.doi },
            authors: { iv: output.authors },
            title: { iv: output.title },
            description: { iv: output.description },
            outputType: { iv: output.outputType },
            publishDate: { iv: output.publishDate },
            createdBy: {
              iv: [
                {
                  displayName,
                  id: [id],
                },
              ],
            },
          },
          searchParams: { publish: true },
        })
        .json(),
    );

    if (err) {
      console.log(err.response.body);
    }
    return romp;
  }

  async fetchUserResearchOutputs(id: string): Promise<CMSResearchOutput[]> {
    const { items } = await this.client
      .get('research-outputs', {
        searchParams: { $filter: `data/createdBy/iv/id eq '${id}'` },
      })
      .json();

    return items;
  }
}
