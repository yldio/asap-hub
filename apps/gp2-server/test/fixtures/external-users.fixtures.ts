import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';

export const getExternalUserCreateDataObject =
  (): gp2Model.ExternalUserCreateDataObject => ({
    name: 'External User',
    orcid: 'orcid-1',
  });
export const getExternalUserDataObject =
  (): gp2Model.ExternalUserDataObject => ({
    name: 'External User',
    orcid: 'orcid-1',
    id: 'id-1',
  });

export const getExternalUserResponse = (): gp2Model.ExternalUserResponse => ({
  displayName: 'External User',
  orcid: 'orcid-1',
  id: 'id-1',
});

export const getFetchExternalUsersResponse =
  (): gp2Model.ListExternalUserResponse => ({
    total: 1,
    items: [getExternalUserResponse()],
  });

export const getContentfulGraphqlExternalUser = (): NonNullable<
  NonNullable<
    gp2Contentful.FetchExternalUsersQuery['externalUsersCollection']
  >['items'][number]
> => ({
  sys: {
    id: 'id-1',
    firstPublishedAt: '2021-11-23T20:45:22Z',
    publishedAt: '2021-11-26T15:33:18Z',
    publishedVersion: 45,
  },
  name: 'External User',
  orcid: 'orcid-1',
});

export const getContentfulGraphqlExternalUsersResponse =
  (): gp2Contentful.FetchExternalUsersQuery => ({
    externalUsersCollection: {
      total: 1,
      items: [getContentfulGraphqlExternalUser()],
    },
  });
