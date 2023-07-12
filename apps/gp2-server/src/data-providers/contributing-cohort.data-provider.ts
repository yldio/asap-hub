import { gp2 as gp2Model } from '@asap-hub/model';

import {
  addLocaleToFields,
  Entry,
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
} from '@asap-hub/contentful';

import { ContributingCohortDataProvider } from './types';

export type ContributingCohortsItem = NonNullable<
  NonNullable<
    gp2Contentful.FetchContributingCohortsQuery['contributingCohortsCollection']
  >['items'][number]
>;

export class ContributingCohortContentfulDataProvider
  implements ContributingCohortDataProvider
{
  constructor(
    private graphQLClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch() {
    const { contributingCohortsCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchContributingCohortsQuery,
      gp2Contentful.FetchContributingCohortsQueryVariables
    >(gp2Contentful.FETCH_CONTRIBUTING_COHORTS, {
      order: [gp2Contentful.ContributingCohortsOrder.NameAsc],
    });

    if (!contributingCohortsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: contributingCohortsCollection?.total,
      items: contributingCohortsCollection?.items
        .filter((x): x is ContributingCohortsItem => x !== null)
        .map(parseContentfulGraphQlContributingCohorts),
    };
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async create(
    cohort: gp2Model.ContributingCohortCreateDataObject,
  ): Promise<string> {
    const environment = await this.getRestClient();
    const createdEntry = await createAndPublishContributingCohort(
      environment,
      cohort,
    );

    return createdEntry.sys.id;
  }
}

export const parseContentfulGraphQlContributingCohorts = (
  item: ContributingCohortsItem,
) => ({
  // Every field in Contentful is marked as nullable even when its required
  // this is because Contentful use the same schema for preview and production
  // Read more in the link below
  // https://www.contentfulcommunity.com/t/why-do-required-fields-appear-as-nullable-in-the-graphql-graph/4079/4
  id: item.sys.id ?? '',
  name: item.name ?? '',
});

const createAndPublishContributingCohort = async (
  environment: Environment,
  cohort: gp2Model.ContributingCohortCreateDataObject,
): Promise<Entry> => {
  const entry = await environment.createEntry('contributingCohorts', {
    fields: addLocaleToFields(cohort),
  });

  return entry.publish();
};
