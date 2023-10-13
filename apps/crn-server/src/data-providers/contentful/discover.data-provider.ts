import { DiscoverDataObject } from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_DISCOVER,
  FetchDiscoverQuery,
  parseRichText,
  RichTextFromQuery,
} from '@asap-hub/contentful';
import { DiscoverDataProvider } from '../types';
import { parseContentfulGraphQlUsers } from './user.data-provider';
import reducer from '../../utils/reducer';
import { parseUserToResponse } from '../../controllers/user.controller';

type DiscoverItem = NonNullable<
  NonNullable<FetchDiscoverQuery['discoverCollection']>['items']
>[number];

type UserItem = NonNullable<
  NonNullable<NonNullable<DiscoverItem>['membersCollection']>['items']
>[number];

type UserResult = ReturnType<typeof parseContentfulGraphQlUsers>;

export class DiscoverContentfulDataProvider implements DiscoverDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(): Promise<DiscoverDataObject> {
    const { discoverCollection } =
      await this.contentfulClient.request<FetchDiscoverQuery>(FETCH_DISCOVER);
    return parseGraphQLDiscover(discoverCollection?.items[0] || null);
  }
}

const reduceUsers = reducer<UserItem, UserResult>(parseContentfulGraphQlUsers);

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
});
