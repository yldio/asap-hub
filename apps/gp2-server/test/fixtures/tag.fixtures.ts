import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';

export const getContentfulGraphqlTags = (): NonNullable<
  NonNullable<gp2Contentful.FetchTagsQuery['tagsCollection']>['items'][number]
> => ({
  name: 'tag-1',
  sys: {
    id: '42',
  },
});

export const getContentfulTagsGraphqlResponse =
  (): gp2Contentful.FetchTagsQuery => ({
    ['tagsCollection']: {
      total: 1,
      items: [getContentfulGraphqlTags()],
    },
  });

export const getContentfulTagsCollectionGraphqlResponse = () => ({
  total: 1,
  items: [getContentfulGraphqlTags()],
});

export const getTagDataObject = (): gp2Model.TagDataObject => ({
  id: '42',
  name: 'tag-1',
});

export const getListTagsDataObject = (): gp2Model.ListTagsDataObject => ({
  total: 1,
  items: [getTagDataObject()],
});

export const getTagCreateDataObject = (): gp2Model.TagCreateDataObject => {
  const { name } = getTagDataObject();

  return {
    name,
  };
};

export const getTagResponse = (): gp2Model.TagResponse => getTagDataObject();

export const getListTagsResponse = (): gp2Model.ListTagsResponse => ({
  total: 1,
  items: [getTagResponse()],
});
