import {
  addLocaleToFields,
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
} from '@asap-hub/contentful';
import { KeywordDataProvider } from './types';
import { gp2 as gp2Model } from '@asap-hub/model';

type Keywords = gp2Contentful.FetchKeywordsQuery['keywordsCollection'];

type KeywordItem = NonNullable<NonNullable<Keywords>['items'][number]>;

export class KeywordContentfulDataProvider implements KeywordDataProvider {
  constructor(
    private graphQLClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch() {
    const { keywordsCollection } =
      await this.graphQLClient.request<gp2Contentful.FetchKeywordsQuery>(
        gp2Contentful.FETCH_KEYWORDS,
      );
    if (!keywordsCollection?.items) {
      return { total: 0, items: [] };
    }

    return {
      total: keywordsCollection.items.length,
      items: keywordsCollection.items
        .filter((keyword): keyword is KeywordItem => keyword !== null)
        .map(parseKeyword),
    };
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async create({ name }: gp2Model.KeywordCreateDataObject) {
    const environment = await this.getRestClient();
    const keywordEntry = await environment.createEntry('keywords', {
      fields: addLocaleToFields({
        name,
      }),
    });

    await keywordEntry.publish();

    return keywordEntry.sys.id;
  }
}

export const parseKeyword = (
  keyword: KeywordItem,
): gp2Model.KeywordDataObject => ({
  id: keyword.sys.id,
  name: keyword.name ?? '',
});
