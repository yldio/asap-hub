import {
  FetchManuscriptVersionByIdQuery,
  FetchManuscriptVersionByIdQueryVariables,
  FetchVersionsByManuscriptQuery,
  FetchVersionsByManuscriptQueryVariables,
  FETCH_MANUSCRIPT_VERSION_BY_ID,
  FETCH_VERSIONS_BY_MANUSCRIPT,
  GraphQLClient,
  ManuscriptsFilter,
} from '@asap-hub/contentful';
import {
  FetchOptions,
  ListManuscriptVersionResponse,
  ManuscriptLifecycle,
  ManuscriptType,
  ManuscriptVersionDataObject,
  ManuscriptVersionResponse,
} from '@asap-hub/model';
import { cleanArray, parseUserDisplayName } from '@asap-hub/server-common';

import { ManuscriptVersionDataProvider } from '../types';
import { LabItem } from './lab.data-provider';
import { getManuscriptVersionUID } from './manuscript.data-provider';

type Manuscript = NonNullable<
  NonNullable<
    FetchVersionsByManuscriptQuery['manuscriptsCollection']
  >['items'][number]
>;
type ManuscriptVersion = NonNullable<
  Manuscript['versionsCollection']
>['items'][number];

export class ManuscriptVersionContentfulDataProvider
  implements ManuscriptVersionDataProvider
{
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(
    options: FetchOptions<ManuscriptsFilter>,
  ): Promise<ListManuscriptVersionResponse> {
    const { take = 8, skip = 0, filter = {} } = options;

    const { manuscriptsCollection } = await this.contentfulClient.request<
      FetchVersionsByManuscriptQuery,
      FetchVersionsByManuscriptQueryVariables
    >(FETCH_VERSIONS_BY_MANUSCRIPT, {
      limit: take,
      skip,
      where: {
        ...filter,
        versions: {
          lifecycle_in: [
            'Preprint',
            'Publication',
            'Publication with addendum or corrigendum',
          ],
        },
      },
    });

    if (!manuscriptsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    const manuscriptVersions = cleanArray(manuscriptsCollection.items).reduce(
      (latestVersions: ManuscriptVersionResponse[], manuscript) => {
        const latestVersion = cleanArray(
          manuscript.versionsCollection?.items,
        )[0];
        if (latestVersion) {
          return [
            ...latestVersions,
            parseGraphQLManucriptVersion(manuscript, latestVersion),
          ];
        }
        return latestVersions;
      },
      [],
    );

    return {
      total: manuscriptsCollection.total,
      items: manuscriptVersions,
    };
  }

  async fetchById(id: string): Promise<ManuscriptVersionDataObject> {
    const { manuscriptVersions } = await this.contentfulClient.request<
      FetchManuscriptVersionByIdQuery,
      FetchManuscriptVersionByIdQueryVariables
    >(FETCH_MANUSCRIPT_VERSION_BY_ID, {
      id,
    });

    if (!manuscriptVersions) {
      return {
        versionFound: false,
      };
    }

    const manuscript =
      manuscriptVersions.linkedFrom?.manuscriptsCollection?.items[0];
    const latestVersion = manuscript?.versionsCollection?.items
      ? cleanArray(manuscript.versionsCollection.items)[0]
      : undefined;

    return {
      versionFound: true,
      latestManuscriptVersion: manuscript
        ? parseGraphQLManucriptVersion(manuscript, latestVersion)
        : undefined,
    };
  }
}

const hasLinkedResearchOutput = (
  latestVersion: ManuscriptVersion | undefined,
): boolean =>
  Boolean(
    (latestVersion?.linkedFrom?.researchOutputsCollection?.total &&
      latestVersion.linkedFrom?.researchOutputsCollection?.total > 0) ||
      (latestVersion?.linkedFrom?.researchOutputVersionsCollection?.total &&
        latestVersion?.linkedFrom?.researchOutputVersionsCollection?.total > 0),
  );

const parseGraphQLManucriptVersion = (
  manuscript: Manuscript,
  latestVersion: ManuscriptVersion | undefined,
): ManuscriptVersionResponse => {
  const team = manuscript?.teamsCollection?.items[0];
  const manuscriptAuthors = cleanArray([
    ...(latestVersion?.firstAuthorsCollection?.items || []),
    ...(latestVersion?.correspondingAuthorCollection?.items || []),
    ...(latestVersion?.additionalAuthorsCollection?.items || []),
  ]);
  const uniqueAuthors = Array.from(
    new Map(
      manuscriptAuthors.map((manuscriptAuthor) => [
        manuscriptAuthor.sys.id,
        manuscriptAuthor,
      ]),
    ).values(),
  );
  return {
    hasLinkedResearchOutput: hasLinkedResearchOutput(latestVersion),
    manuscriptId: latestVersion
      ? getManuscriptVersionUID({
          version: {
            type: latestVersion.type,
            count: latestVersion.count,
            lifecycle: latestVersion.lifecycle,
          },
          teamIdCode: team?.teamId || '',
          grantId: team?.grantId || '',
          manuscriptCount: manuscript?.count || 0,
        })
      : undefined,
    versionId: latestVersion?.sys.id || undefined,
    id: `mv-${manuscript.sys.id}`,
    title: manuscript?.title || '',
    url: manuscript?.url || '',
    type: (latestVersion?.type as ManuscriptType) || undefined,
    lifecycle: (latestVersion?.lifecycle as ManuscriptLifecycle) || undefined,
    description: latestVersion?.description || undefined,
    shortDescription: latestVersion?.shortDescription || undefined,
    impact: manuscript?.impact
      ? {
          id: manuscript.impact.sys.id,
          name: manuscript.impact.name || '',
        }
      : undefined,
    categories: cleanArray(manuscript.categoriesCollection?.items || []).map(
      (category) => ({
        id: category.sys.id,
        name: category.name || '',
      }),
    ),
    teams: cleanArray(latestVersion?.teamsCollection?.items).map(
      (teamItem) => ({
        id: teamItem.sys.id,
        displayName: teamItem.displayName || '',
      }),
    ),
    labs: cleanArray(latestVersion?.labsCollection?.items).map(
      (lab: LabItem) => ({
        id: lab.sys.id,
        name: lab.name || '',
      }),
    ),
    authors: uniqueAuthors.map((author) => {
      if (author.__typename === 'Users') {
        return {
          id: author.sys.id,
          firstName: author.firstName || '',
          lastName: author.lastName || '',
          email: author.email || '',
          displayName: parseUserDisplayName(
            author.firstName || '',
            author.lastName || '',
            undefined,
            author.nickname || '',
          ),
          avatarUrl: author.avatar?.url || undefined,
          alumniSinceDate: author.alumniSinceDate || undefined,
        };
      }

      return {
        id: author.sys.id,
        displayName: author?.name || '',
        orcid: author.orcid || '',
      };
    }),
    teamId: team?.sys.id,
  };
};
