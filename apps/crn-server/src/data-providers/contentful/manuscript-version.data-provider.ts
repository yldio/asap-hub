import {
  Environment,
  FetchComplianceManuscriptVersionsQuery,
  FetchComplianceManuscriptVersionsQueryVariables,
  FetchManuscriptVersionByIdQuery,
  FetchManuscriptVersionByIdQueryVariables,
  FetchVersionsByManuscriptQuery,
  FetchVersionsByManuscriptQueryVariables,
  FETCH_COMPLIANCE_MANUSCRIPT_VERSIONS,
  FETCH_MANUSCRIPT_VERSION_BY_ID,
  FETCH_VERSIONS_BY_MANUSCRIPT,
  GraphQLClient,
  Link,
  ManuscriptsFilter,
  ManuscriptVersionsFilter,
} from '@asap-hub/contentful';
import {
  FetchOptions,
  ListManuscriptVersionExportResponse,
  ListManuscriptVersionResponse,
  ManuscriptLifecycle,
  ManuscriptType,
  ManuscriptVersionDataObject,
  ManuscriptVersionExport,
  ManuscriptVersionResponse,
  mapManuscriptLifecycleToType,
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

type ComplianceManuscriptVersion = NonNullable<
  NonNullable<
    FetchComplianceManuscriptVersionsQuery['manuscriptVersionsCollection']
  >['items'][number]
>;

export class ManuscriptVersionContentfulDataProvider
  implements ManuscriptVersionDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient?: () => Promise<Environment>,
  ) {}

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

  /**
   * Returns all manuscript version IDs linked to a given entry.
   *
   * - For `manuscripts`: reads version IDs directly from the entry
   * - For other types: resolves both direct links (manuscriptVersions)
   *   and indirect links via manuscripts
   *
   * Results are de-duplicated.
   *
   * Throws if the REST client is not configured.
   */
  async fetchManuscriptVersionIdsByLinkedEntry(
    entryId: string,
    entryType: string,
  ): Promise<string[]> {
    if (!this.getRestClient) {
      throw new Error(
        'REST client not configured for ManuscriptVersionContentfulDataProvider',
      );
    }
    const environment = await this.getRestClient();

    if (entryType === 'manuscripts') {
      const manuscript = await environment.getEntry(entryId, {
        content_type: 'manuscripts',
      });

      const versionIds =
        manuscript.fields?.versions?.['en-US']?.map(
          (v: Link<'Entry'>) => v.sys.id,
        ) ?? [];

      return versionIds;
    }

    const results = new Set<string>();

    const add = (ids: string[]) => {
      ids.forEach((id) => results.add(id));
    };

    const directVersionLinks = await environment.getEntries({
      content_type: 'manuscriptVersions',
      links_to_entry: entryId,
      limit: 1000,
    });
    add(directVersionLinks.items.map((i) => i.sys.id));

    const manuscripts = await environment.getEntries({
      content_type: 'manuscripts',
      links_to_entry: entryId,
      limit: 1000,
    });

    for (const linkedManuscript of manuscripts.items) {
      const versionIds =
        linkedManuscript.fields?.versions?.['en-US'].map(
          (v: Link<'Entry'>) => v.sys.id,
        ) ?? [];
      versionIds.forEach((id: string) => results.add(id));
    }
    return [...results];
  }

  async fetchComplianceManuscriptVersions(
    options: FetchOptions<string[]>,
  ): Promise<ListManuscriptVersionExportResponse> {
    const { take = 8, skip = 0, filter } = options;

    const ids = filter ?? [];

    const searchQuery: ManuscriptVersionsFilter = {
      sys: {
        ...(ids.length ? { id_in: ids } : {}),
      },
    };

    const variables: FetchComplianceManuscriptVersionsQueryVariables = {
      where: searchQuery,
      ...(ids.length ? {} : { limit: take, skip }),
    };

    const { manuscriptVersionsCollection } =
      await this.contentfulClient.request<
        FetchComplianceManuscriptVersionsQuery,
        FetchComplianceManuscriptVersionsQueryVariables
      >(FETCH_COMPLIANCE_MANUSCRIPT_VERSIONS, variables);

    const manuscriptVersions = cleanArray(
      manuscriptVersionsCollection?.items,
    ).map(parseGraphQLComplianceManuscriptVersion);
    return {
      total: manuscriptVersionsCollection?.total || 0,
      items: manuscriptVersions,
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
  const project =
    team?.linkedFrom?.projectMembershipCollection?.items[0]?.linkedFrom
      ?.projectsCollection?.items[0];

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
          teamIdCode: project?.projectId || '',
          grantId: project?.grantId || '',
          manuscriptCount: manuscript?.count || 0,
        })
      : undefined,
    versionId: latestVersion?.sys.id || undefined,
    id: `mv-${manuscript.sys.id}`,
    title: manuscript?.title || '',
    url: latestVersion?.url || manuscript?.url || '',
    type: (latestVersion?.type as ManuscriptType) || undefined,
    lifecycle: (latestVersion?.lifecycle as ManuscriptLifecycle) || undefined,
    description: latestVersion?.description || undefined,
    shortDescription: latestVersion?.shortDescription || undefined,
    researchOutputId: manuscript?.relatedResearchOutput?.sys.id || undefined,
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
    doi:
      (latestVersion?.lifecycle &&
      mapManuscriptLifecycleToType(
        latestVersion.lifecycle as ManuscriptLifecycle,
      ) === 'Preprint'
        ? latestVersion?.preprintDoi
        : latestVersion?.publicationDoi) || undefined,
  };
};

const parseGraphQLComplianceManuscriptVersion = (
  manuscriptVersion: ComplianceManuscriptVersion,
): ManuscriptVersionExport => {
  const manuscript =
    manuscriptVersion.linkedFrom?.manuscriptsCollection?.items[0];
  const generatingTeam = manuscript?.teamsCollection?.items[0];
  const generatingProject = manuscript?.project;
  const isUserBasedProjectManuscript = !!generatingProject?.sys.id;
  const project = isUserBasedProjectManuscript
    ? generatingProject
    : generatingTeam?.linkedFrom?.projectMembershipCollection?.items[0]
        ?.linkedFrom?.projectsCollection?.items[0];
  const linkedComplianceReport =
    manuscriptVersion.linkedFrom?.complianceReportsCollection?.items[0];

  return {
    id: manuscriptVersion.sys.id,
    title: manuscript?.title || '',
    manuscriptId: getManuscriptVersionUID({
      version: {
        type: manuscriptVersion.type,
        count: manuscriptVersion.count,
        lifecycle: manuscriptVersion.lifecycle,
      },
      teamIdCode: project?.projectId || '',
      grantId: project?.grantId || '',
      manuscriptCount: manuscript?.count || 0,
    }),
    url: manuscript?.url || '',
    type: manuscriptVersion?.type || '',
    lifecycle: manuscriptVersion?.lifecycle || '',
    preprintDoi: manuscriptVersion?.preprintDoi || '',
    publicationDoi: manuscriptVersion?.publicationDoi || '',
    otherDetails: manuscriptVersion?.otherDetails || '',
    manuscriptFile: manuscriptVersion.manuscriptFile?.url || '',
    keyResourceTable: manuscriptVersion.keyResourceTable?.url || '',
    additionalFiles: cleanArray(
      manuscriptVersion.additionalFilesCollection?.items,
    )
      .map((file) => file.url)
      .join(', '),
    description: manuscriptVersion?.description || '',
    shortDescription: manuscriptVersion?.shortDescription || '',
    mainProject: project?.title || '',
    teams: cleanArray(manuscriptVersion.teamsCollection?.items)
      .map((teamItem) => teamItem.displayName)
      .join(', '),
    firstAuthors: parseGraphQLAuthor(
      cleanArray(manuscriptVersion?.firstAuthorsCollection?.items),
    ).join(', '),
    labs: cleanArray(manuscriptVersion?.labsCollection?.items)
      .map((lab) => lab.name)
      .join(', '),
    correspondingAuthor: parseGraphQLAuthor(
      cleanArray(manuscriptVersion?.correspondingAuthorCollection?.items),
    ).join(', '),
    additionalAuthors: parseGraphQLAuthor(
      cleanArray(manuscriptVersion?.additionalAuthorsCollection?.items),
    ).join(', '),
    status: manuscript?.status || '',
    acknowledgedGrantNumber: manuscriptVersion.acknowledgedGrantNumber || '',
    acknowledgedGrantNumberDetails:
      manuscriptVersion.acknowledgedGrantNumberDetails || '',
    asapAffiliationIncluded: manuscriptVersion.asapAffiliationIncluded || '',
    asapAffiliationIncludedDetails:
      manuscriptVersion.asapAffiliationIncludedDetails || '',
    availabilityStatement: manuscriptVersion.availabilityStatement || '',
    availabilityStatementDetails:
      manuscriptVersion.availabilityStatementDetails || '',
    codeDeposited: manuscriptVersion.codeDeposited || '',
    codeDepositedDetails: manuscriptVersion.codeDepositedDetails || '',
    datasetsDeposited: manuscriptVersion.datasetsDeposited || '',
    datasetsDepositedDetails: manuscriptVersion.datasetsDepositedDetails || '',
    labMaterialsRegistered: manuscriptVersion.labMaterialsRegistered || '',
    labMaterialsRegisteredDetails:
      manuscriptVersion.labMaterialsRegisteredDetails || '',
    protocolsDeposited: manuscriptVersion.protocolsDeposited || '',
    protocolsDepositedDetails:
      manuscriptVersion.protocolsDepositedDetails || '',
    manuscriptLicense: manuscriptVersion.manuscriptLicense || '',
    manuscriptLicenseDetails: manuscriptVersion.manuscriptLicenseDetails || '',
    complianceReportDescription: linkedComplianceReport?.description || '',
    complianceReportUrl: linkedComplianceReport?.url || '',
    apcRequested: String(!!manuscript?.apcRequested),
    apcAmountRequested:
      manuscript?.apcAmountRequested != null
        ? Number(manuscript.apcAmountRequested).toString()
        : '',
    apcCoverageRequestStatus: manuscript?.apcCoverageRequestStatus || '',
    apcAmountPaid:
      manuscript?.apcAmountRequested != null
        ? Number(manuscript.apcAmountPaid).toString()
        : '',
    declinedReason: manuscript?.declinedReason || '',
    assignedUsers: cleanArray(manuscript?.assignedUsersCollection?.items)
      .map((user) =>
        parseUserDisplayName(
          user.firstName || '',
          user.lastName || '',
          user.middleName || '',
          user.nickname || '',
        ),
      )
      .join(', '),
    impact: manuscript?.impact?.name || '',
    categories: cleanArray(manuscript?.categoriesCollection?.items)
      .map((category) => category.name)
      .join(', '),
    versionLastUpdatedDate: manuscriptVersion.sys.publishedAt || '',
  };
};

const parseGraphQLAuthor = (
  authorItems: NonNullable<
    NonNullable<
      ComplianceManuscriptVersion['firstAuthorsCollection']
    >['items'][number]
  >[],
) =>
  authorItems.map((author) => {
    if (author.__typename === 'Users') {
      return parseUserDisplayName(
        author.firstName || '',
        author.lastName || '',
        author.middleName || '',
        author.nickname || '',
      );
    }

    return author?.name || '';
  });
