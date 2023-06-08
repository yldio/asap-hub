import { DiscoverDataObject } from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_DISCOVER,
  FetchDiscoverQuery,
  parseRichText,
  RichTextFromQuery,
} from '@asap-hub/contentful';
import { DiscoverDataProvider } from '../types';
import { parseContentfulGraphQlUsers } from './users.data-provider';
import { parseUserToResponse } from '../users.data-provider';
import { parseContentfulGraphQlPages } from './pages.data-provider';
import { parseContentfulGraphQlTutorials } from './tutorials.data-provider';

type DiscoverItem = NonNullable<
  NonNullable<FetchDiscoverQuery['discoverCollection']>['items']
>[number];

type UserItem = NonNullable<
  NonNullable<NonNullable<DiscoverItem>['membersCollection']>['items']
>[number];

type TutorialItem = NonNullable<
  NonNullable<NonNullable<DiscoverItem>['trainingCollection']>['items']
>[number];

type PageItem = NonNullable<
  NonNullable<NonNullable<DiscoverItem>['pagesCollection']>['items']
>[number];

type UserResult = ReturnType<typeof parseContentfulGraphQlUsers>;
type PageResult = ReturnType<typeof parseContentfulGraphQlPages>;
type TutorialResult = ReturnType<typeof parseContentfulGraphQlTutorials>;

export class DiscoverContentfulDataProvider implements DiscoverDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(): Promise<DiscoverDataObject> {
    const { discoverCollection } =
      await this.contentfulClient.request<FetchDiscoverQuery>(FETCH_DISCOVER);

    return parseGraphQLDiscover(discoverCollection?.items[0] || null);
  }
}

const reducer =
  <T, K>(fn: (item: NonNullable<T>) => K) =>
  (acc: K[], item: T) => {
    if (!item) {
      return acc;
    }
    return [...acc, fn(item)];
  };

const reduceUsers = reducer<UserItem, UserResult>(parseContentfulGraphQlUsers);
const reduceTutorials = reducer<TutorialItem, TutorialResult>(
  parseContentfulGraphQlTutorials,
);
const reducePages = reducer<PageItem, PageResult>(parseContentfulGraphQlPages);

const parseGraphQLDiscover = (
  discover: DiscoverItem | null,
): DiscoverDataObject => ({
  aboutUs: discover?.aboutUs
    ? parseRichText(discover.aboutUs as RichTextFromQuery)
    : '',
  members:
    discover?.membersCollection?.items
      ?.reduce(reduceUsers, [])
      .map(parseUserToResponse) ?? [],
  membersTeamId: discover?.membersTeam?.sys.id,
  scientificAdvisoryBoard:
    discover?.scientificAdvisoryBoardCollection?.items
      ?.reduce(reduceUsers, [])
      .map(parseUserToResponse) ?? [],
  pages: discover?.pagesCollection?.items?.reduce(reducePages, []) ?? [],
  training:
    discover?.trainingCollection?.items?.reduce(reduceTutorials, []) ?? [],
});
