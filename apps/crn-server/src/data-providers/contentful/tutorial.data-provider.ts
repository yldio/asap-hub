import {
  convertDecisionToBoolean,
  ListResponse,
  TutorialsDataObject,
  TutorialsSharingStatus,
  sharingStatuses,
  FetchOptions,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_TUTORIAL_BY_ID,
  FetchTutorialByIdQuery,
  FetchTutorialByIdQueryVariables,
  parseRichText,
  RichTextFromQuery,
  TutorialsFilter,
  FetchTutorialsQuery,
  FetchTutorialsQueryVariables,
  FETCH_TUTORIALS,
} from '@asap-hub/contentful';
import { TutorialDataProvider } from '../types';
import { cleanArray } from '../../utils/clean-array';

type TutorialItem = NonNullable<FetchTutorialByIdQuery['tutorials']>;

type TeamItem = NonNullable<
  NonNullable<TutorialItem['teamsCollection']>['items'][number]
>;

type RelatedEventItem = NonNullable<
  NonNullable<TutorialItem['relatedEventsCollection']>['items'][number]
>;

type RelatedTutorialItem = NonNullable<
  NonNullable<TutorialItem['relatedTutorialsCollection']>['items'][number]
>;

type AuthorItem = NonNullable<
  NonNullable<TutorialItem['authorsCollection']>['items'][number]
>;

export class TutorialContentfulDataProvider implements TutorialDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(
    options: FetchOptions<string[]>,
  ): Promise<ListResponse<TutorialsDataObject>> {
    const { take = 10, skip = 0, search } = options;

    const where: TutorialsFilter = {};

    const searchTerms = (search || '').split(' ').filter(Boolean);

    if (searchTerms.length) {
      where.OR = [
        ...searchTerms.map((term) => ({ title_contains: term })),
        ...searchTerms.map((term) => ({ shortText_contains: term })),
        ...searchTerms.map((term) => ({ tags: { name: term } })),
        ...searchTerms.map((term) => ({ teams: { displayName: term } })),
      ];
    }
    const { discoverCollection } = await this.contentfulClient.request<
      FetchTutorialsQuery,
      FetchTutorialsQueryVariables
    >(FETCH_TUTORIALS, {
      limit: take,
      skip,
      where: searchTerms.length ? where : null,
    });

    const trainingCollection = discoverCollection?.items[0]?.trainingCollection;

    if (!trainingCollection) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: trainingCollection.total,
      items: cleanArray(trainingCollection?.items).map(
        parseContentfulGraphQlTutorials,
      ),
    };
  }

  async fetchById(id: string): Promise<TutorialsDataObject | null> {
    const { tutorials } = await this.contentfulClient.request<
      FetchTutorialByIdQuery,
      FetchTutorialByIdQueryVariables
    >(FETCH_TUTORIAL_BY_ID, { id });

    if (!tutorials) {
      return null;
    }

    return parseContentfulGraphQlTutorials(tutorials);
  }
}

const isTutorialSharingStatus = (
  status: string,
): status is TutorialsSharingStatus =>
  (sharingStatuses as ReadonlyArray<string>).includes(status);

const mapTeams = (items: TeamItem[]) =>
  items.map((team) => ({
    id: team.sys.id,
    displayName: team.displayName || '',
  }));

const mapEvents = (items: RelatedEventItem[]) =>
  items.map((event) => ({
    id: event.sys.id,
    title: event?.title || '',
    endDate: event.endDate || '',
  }));

const mapAuthors = (items: AuthorItem[]) =>
  items
    .filter(
      (author) => author.__typename !== 'Users' || author?.onboarded !== false,
    )
    .map((author) => {
      if (author.__typename === 'Users') {
        return {
          id: author.sys.id,
          firstName: author.firstName || '',
          lastName: author.lastName || '',
          email: author.email || '',
          displayName: `${author.firstName} ${author.lastName}`,
          avatarUrl: author.avatar?.url || undefined,
          alumniSinceDate: author.alumniSinceDate || undefined,
        };
      }

      return {
        id: author.sys.id,
        displayName: author?.name || '',
        orcid: author.orcid || '',
      };
    });

const mapRelatedTutorials = (
  items: RelatedTutorialItem[],
  isOwnRelatedTutorialLink: boolean,
) =>
  items.map((rt: RelatedTutorialItem) => ({
    id: rt?.sys.id,
    title: rt.title || '',
    created: rt.addedDate,
    isOwnRelatedTutorialLink,
  }));

export const parseContentfulGraphQlTutorials = (
  tutorial: TutorialItem,
): TutorialsDataObject => {
  const teams = mapTeams(cleanArray(tutorial.teamsCollection?.items));
  const authors = mapAuthors(cleanArray(tutorial.authorsCollection?.items));
  const relatedEvents = mapEvents(
    cleanArray(tutorial.relatedEventsCollection?.items),
  );
  return {
    id: tutorial.sys.id,
    created: tutorial.addedDate,
    title: tutorial.title || '',
    text: tutorial.text
      ? parseRichText(tutorial.text as RichTextFromQuery)
      : undefined,
    shortText: tutorial.shortText || undefined,
    link: tutorial.link || undefined,
    linkText: tutorial.linkText || undefined,
    thumbnail: tutorial.thumbnail?.url || undefined,
    asapFunded: convertDecisionToBoolean(tutorial.asapFunded || null),
    usedInPublication: convertDecisionToBoolean(
      tutorial.usedInAPublication || null,
    ),
    sharingStatus:
      tutorial.sharingStatus && isTutorialSharingStatus(tutorial.sharingStatus)
        ? tutorial.sharingStatus
        : 'Network Only',
    tags:
      tutorial.tagsCollection?.items
        .map((tag) => tag?.name || '')
        .filter(Boolean) || [],
    authors,
    relatedEvents,
    teams,
    relatedTutorials: [
      ...mapRelatedTutorials(
        cleanArray(tutorial.relatedTutorialsCollection?.items),
        true,
      ),
      ...mapRelatedTutorials(
        cleanArray(tutorial.linkedFrom?.tutorialsCollection?.items),
        false,
      ),
    ],
  };
};
