import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 } from '@asap-hub/model';
import { getEntry } from './contentful.fixtures';

export const getContentfulGraphqlContributingCohorts = (): NonNullable<
  NonNullable<
    gp2Contentful.FetchContributingCohortsQuery['contributingCohortsCollection']
  >['items'][number]
> => ({
  name: 'some name',
  sys: {
    id: '42',
  },
});

export const getContentfulContributingCohortsGraphqlResponse =
  (): gp2Contentful.FetchContributingCohortsQuery => ({
    contributingCohortsCollection: {
      total: 1,
      items: [getContentfulGraphqlContributingCohorts()],
    },
  });

export const getContributingCohortDataObject =
  (): gp2.ContributingCohortDataObject => ({
    id: '42',
    name: 'some name',
  });

export const getListContributingCohortDataObject =
  (): gp2.ListContributingCohortDataObject => ({
    total: 1,
    items: [getContributingCohortDataObject()],
  });

export const getContributingCohortResponse =
  (): gp2.ContributingCohortResponse => getContributingCohortDataObject();

export const getListContributingCohortResponse =
  (): gp2.ListContributingCohortResponse => ({
    total: 1,
    items: [getContributingCohortDataObject()],
  });
export const getContributingCohortCreateDataObject =
  (): gp2.ContributingCohortCreateDataObject => {
    const { id: _id, ...created } = getContributingCohortDataObject();

    return created;
  };
export const fetchContributingCohortResponse = () => ({
  id: 'cohortId',
  data: {
    name: { iv: 'some name ' },
  },
});

export const getContributingCohortContentfulEntry = () =>
  getEntry({
    fields: {
      sys: {
        id: 'cohort-1',
      },
    },
  });
