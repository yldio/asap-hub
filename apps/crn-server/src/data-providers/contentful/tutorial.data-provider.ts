import {
  convertDecisionToBoolean,
  ListResponse,
  TutorialsDataObject,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_TUTORIAL_BY_ID,
  FetchTutorialByIdQuery,
  FetchTutorialByIdQueryVariables,
  parseRichText,
  RichTextFromQuery,
} from '@asap-hub/contentful';
import { TutorialDataProvider } from '../types';
import { isTutorialSharingStatus } from '../transformers/tutorials';

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

  async fetch(): Promise<ListResponse<TutorialsDataObject>> {
    throw new Error('Method not implemented.');
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

const mapTeams = (items: (TeamItem | null)[]) =>
  items
    .filter((team: TeamItem | null): team is TeamItem => team !== null)
    .map((team) => ({
      id: team.sys.id,
      displayName: team.displayName || '',
    }));

const mapRelatedTutorials = (
  items: (RelatedTutorialItem | null)[],
  isOwnRelatedTutorialLink: boolean,
) =>
  items
    .filter(
      (rt: RelatedTutorialItem | null): rt is RelatedTutorialItem =>
        rt !== null,
    )
    .map((rt: RelatedTutorialItem) => ({
      id: rt?.sys.id,
      title: rt.title || '',
      created: rt.publishDate,
      isOwnRelatedTutorialLink,
    }));

export const parseContentfulGraphQlTutorials = (
  tutorial: TutorialItem,
): TutorialsDataObject => {
  const teams = mapTeams(tutorial.teamsCollection?.items || []);
  return {
    id: tutorial.sys.id,
    created: tutorial.publishDate,
    title: tutorial.title || '',
    text: tutorial.text
      ? parseRichText(tutorial.text as RichTextFromQuery)
      : undefined,
    shortText: tutorial.shortText || undefined,
    link: tutorial.link || undefined,
    linkText: tutorial.linkText || undefined,
    thumbnail: tutorial.thumbnail?.url || undefined,
    addedDate: tutorial.addedDate,
    asapFunded: convertDecisionToBoolean(tutorial.asapFunded || null),
    usedInPublication: convertDecisionToBoolean(
      tutorial.usedInAPublication || null,
    ),
    sharingStatus:
      tutorial.sharingStatus && isTutorialSharingStatus(tutorial.sharingStatus)
        ? tutorial.sharingStatus
        : 'Network Only',
    authors:
      tutorial.authorsCollection?.items
        ?.filter((author): author is AuthorItem => author !== null)
        ?.filter(
          (author) =>
            author.__typename !== 'Users' || author?.onboarded !== false,
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
        }) || [],
    tags:
      tutorial.tagsCollection?.items
        .map((tag) => tag?.name || '')
        .filter(Boolean) || [],
    relatedEvents:
      tutorial.relatedEventsCollection?.items
        ?.filter((event): event is RelatedEventItem => event !== null)
        .map((event) => ({
          id: event.sys.id,
          title: event?.title || '',
          endDate: event.endDate || '',
        })) || [],
    teams,
    relatedTutorials: [
      ...mapRelatedTutorials(
        tutorial.relatedTutorialsCollection?.items || [],
        true,
      ),
      ...mapRelatedTutorials(
        tutorial.linkedFrom?.tutorialsCollection?.items || [],
        false,
      ),
    ],
  };
};
