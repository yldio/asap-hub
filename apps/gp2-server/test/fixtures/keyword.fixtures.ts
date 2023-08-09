import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';

export const getContentfulGraphqlKeywords = (): NonNullable<
  NonNullable<
    gp2Contentful.FetchKeywordsQuery['keywordsCollection']
  >['items'][number]
> => ({
  name: 'keyword-1',
  sys: {
    id: '42',
  },
});

export const getContentfulKeywordsGraphqlResponse =
  (): gp2Contentful.FetchKeywordsQuery => ({
    keywordsCollection: {
      total: 1,
      items: [getContentfulGraphqlKeywords()],
    },
  });

export const getKeywordDataObject = (): gp2Model.KeywordDataObject => ({
  id: '42',
  name: 'keyword-1',
});

export const getListKeywordsDataObject =
  (): gp2Model.ListKeywordsDataObject => ({
    total: 1,
    items: [getKeywordDataObject()],
  });

export const getKeywordCreateDataObject =
  (): gp2Model.KeywordCreateDataObject => {
    const { name } = getKeywordDataObject();

    return {
      name,
    };
  };

export const getKeywordResponse = (): gp2Model.KeywordResponse =>
  getKeywordDataObject();

export const getListKeywordsResponse = (): gp2Model.ListKeywordsResponse => ({
  total: 1,
  items: [getKeywordResponse()],
});
