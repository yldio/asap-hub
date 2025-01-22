import {
  addLocaleToFields,
  Environment,
  FetchManuscriptByIdQuery,
  FetchManuscriptByIdQueryVariables,
  FetchManuscriptsByTeamIdQuery,
  FetchManuscriptsQuery,
  FetchManuscriptsQueryVariables,
  FETCH_MANUSCRIPTS,
  FETCH_MANUSCRIPTS_BY_TEAM_ID,
  FETCH_MANUSCRIPT_BY_ID,
  getLinkAsset,
  getLinkAssets,
  getLinkEntities,
  getLinkEntity,
  GraphQLClient,
  Link,
  Maybe,
  patchAndPublish,
} from '@asap-hub/contentful';
import {
  ApcCoverageOption,
  FetchOptions,
  ListPartialManuscriptResponse,
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  ManuscriptLifecycle,
  manuscriptLifecycles,
  manuscriptMapStatus,
  ManuscriptResubmitDataObject,
  ManuscriptType,
  manuscriptTypes,
  ManuscriptUpdateDataObject,
  ManuscriptVersion,
  QuickCheckDetails,
  QuickCheckDetailsObject,
} from '@asap-hub/model';
import { parseUserDisplayName } from '@asap-hub/server-common';

import { ManuscriptDataProvider } from '../types';
import { Discussion, parseGraphQLDiscussion } from './discussion.data-provider';

type ManuscriptItem = NonNullable<FetchManuscriptByIdQuery['manuscripts']>;
type ManuscriptListItem = NonNullable<
  NonNullable<FetchManuscriptsQuery['manuscriptsCollection']>['items'][number]
>;

type ComplianceReport = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<ManuscriptItem['versionsCollection']>['items'][number]
    >['linkedFrom']
  >['complianceReportsCollection']
>['items'][number];

export class ManuscriptContentfulDataProvider
  implements ManuscriptDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(options: FetchOptions): Promise<ListPartialManuscriptResponse> {
    const { take = 8, skip = 0 } = options;

    const { manuscriptsCollection } = await this.contentfulClient.request<
      FetchManuscriptsQuery,
      FetchManuscriptsQueryVariables
    >(FETCH_MANUSCRIPTS, {
      limit: take,
      skip,
    });

    if (!manuscriptsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: manuscriptsCollection?.total,
      items: manuscriptsCollection?.items
        .filter((x): x is ManuscriptListItem => x !== null)
        .map((manuscript) => {
          const version = manuscript.versionsCollection?.items[0];
          const team = manuscript.teamsCollection?.items[0];
          return {
            status: manuscriptMapStatus(manuscript.status) || undefined,
            id: getManuscriptVersionUID({
              version: {
                type: version?.type,
                count: version?.count,
                lifecycle: version?.lifecycle,
              },
              teamIdCode: team?.teamId || '',
              grantId: team?.grantId || '',
              manuscriptCount: manuscript.count || 0,
            }),
            requestingApcCoverage:
              version?.requestingApcCoverage as ApcCoverageOption,
            lastUpdated: version?.sys.publishedAt,
            team: {
              id: team?.sys.id || '',
              displayName: team?.displayName || '',
            },
          };
        }),
    };
  }

  async fetchCountByTeamId(id: string) {
    const { teams } = await this.contentfulClient.request<
      FetchManuscriptsByTeamIdQuery,
      FetchManuscriptByIdQueryVariables
    >(FETCH_MANUSCRIPTS_BY_TEAM_ID, { id });

    return (
      teams?.linkedFrom?.manuscriptsCollection?.items.filter(
        (item) => item?.teamsCollection?.items[0]?.sys.id === id,
      ).length || 0
    );
  }

  async fetchById(id: string): Promise<ManuscriptDataObject | null> {
    const { manuscripts } = await this.contentfulClient.request<
      FetchManuscriptByIdQuery,
      FetchManuscriptByIdQueryVariables
    >(FETCH_MANUSCRIPT_BY_ID, { id });

    if (!manuscripts) {
      return null;
    }

    return parseGraphQLManuscript(manuscripts);
  }
  private async createManuscriptAssets(
    version: Pick<
      ManuscriptCreateDataObject['versions'][number],
      'manuscriptFile' | 'keyResourceTable' | 'additionalFiles'
    >,
  ) {
    const environment = await this.getRestClient();

    const manuscriptFileAsset = await environment.getAsset(
      version.manuscriptFile.id,
    );
    await manuscriptFileAsset.publish();

    if (version.keyResourceTable) {
      const keyResourceTableAsset = await environment.getAsset(
        version.keyResourceTable.id,
      );
      await keyResourceTableAsset.publish();
    }

    version.additionalFiles?.forEach(async (additionalFile) => {
      const additionalFileAsset = await environment.getAsset(additionalFile.id);
      await additionalFileAsset.publish();
    });
  }

  private async createQuickChecks(
    version: Pick<
      ManuscriptCreateDataObject['versions'][number],
      QuickCheckDetails
    >,
    userId: string,
  ) {
    const environment = await this.getRestClient();

    const quickCheckDetails = {
      asapAffiliationIncludedDetails: version.asapAffiliationIncludedDetails,
      acknowledgedGrantNumberDetails: version.acknowledgedGrantNumberDetails,
      availabilityStatementDetails: version.availabilityStatementDetails,
      codeDepositedDetails: version.codeDepositedDetails,
      datasetsDepositedDetails: version.datasetsDepositedDetails,
      labMaterialsRegisteredDetails: version.labMaterialsRegisteredDetails,
      manuscriptLicenseDetails: version.manuscriptLicenseDetails,
      protocolsDepositedDetails: version.protocolsDepositedDetails,
    };

    const quickCheckDiscussions = await createQuickCheckDiscussions(
      environment,
      quickCheckDetails,
      userId,
    );

    return quickCheckDiscussions;
  }

  private async createManuscriptVersion(
    version: ManuscriptCreateDataObject['versions'][number],
    userId: string,
    versionCount: number,
  ): Promise<string> {
    const environment = await this.getRestClient();

    await this.createManuscriptAssets(version);
    const quickCheckDiscussions = await this.createQuickChecks(version, userId);

    const manuscriptVersionEntry = await environment.createEntry(
      'manuscriptVersions',
      {
        fields: addLocaleToFields({
          ...version,
          count: versionCount,
          teams: getLinkEntities(version.teams),
          firstAuthors: getLinkEntities(version.firstAuthors),
          correspondingAuthor: getLinkEntities(version.correspondingAuthor),
          additionalAuthors: getLinkEntities(version.additionalAuthors),
          labs: version?.labs?.length ? getLinkEntities(version.labs) : [],
          manuscriptFile: getLinkAsset(version.manuscriptFile.id),
          keyResourceTable: version.keyResourceTable
            ? getLinkAsset(version.keyResourceTable.id)
            : null,
          additionalFiles: version.additionalFiles?.length
            ? getLinkAssets(
                version.additionalFiles.map(
                  (additionalFile) => additionalFile.id,
                ),
              )
            : null,
          createdBy: getLinkEntity(userId),
          updatedBy: getLinkEntity(userId),
          ...quickCheckDiscussions,
        }),
      },
    );

    await manuscriptVersionEntry.publish();

    return manuscriptVersionEntry.sys.id;
  }

  async create(input: ManuscriptCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const {
      teamId,
      userId,
      versions: [version],
      ...plainFields
    } = input;

    if (!version) {
      throw new Error('No versions provided');
    }

    const currentCount = (await this.fetchCountByTeamId(teamId)) || 0;

    const manuscriptVersionId = await this.createManuscriptVersion(
      version,
      userId,
      1,
    );

    const manuscriptEntry = await environment.createEntry('manuscripts', {
      fields: addLocaleToFields({
        ...plainFields,
        count: currentCount + 1,
        teams: getLinkEntities(version.teams),
        versions: getLinkEntities([manuscriptVersionId]),
        status: 'Waiting for Report',
      }),
    });

    await manuscriptEntry.publish();

    return manuscriptEntry.sys.id;
  }

  async createVersion(
    id: string,
    input: ManuscriptResubmitDataObject,
  ): Promise<void> {
    const {
      userId,
      versions: [version],
      title,
    } = input;

    if (!version) {
      throw new Error('No versions provided');
    }

    const environment = await this.getRestClient();
    const manuscriptEntry = await environment.getEntry(id);
    const previousVersions = manuscriptEntry.fields.versions['en-US'];

    const manuscriptVersionId = await this.createManuscriptVersion(
      version,
      userId,
      previousVersions.length + 1,
    );

    const newVersion = getLinkEntity(manuscriptVersionId);

    await patchAndPublish(manuscriptEntry, {
      versions: [...previousVersions, newVersion],
      title,
      teams: getLinkEntities(version.teams),
      status: 'Manuscript Resubmitted',
    });
  }

  async update(
    id: string,
    manuscriptData: ManuscriptUpdateDataObject,
    userId: string,
  ): Promise<void> {
    const environment = await this.getRestClient();
    const manuscriptEntry = await environment.getEntry(id);

    if ('status' in manuscriptData) {
      const previousStatus = manuscriptEntry.fields.status['en-US'];

      await patchAndPublish(manuscriptEntry, {
        status: manuscriptData.status,
        previousStatus,
        statusUpdatedBy: getLinkEntity(userId),
        statusUpdatedAt: new Date(),
      });
    }

    if ('versions' in manuscriptData && manuscriptData.versions?.[0]) {
      const version = manuscriptData.versions[0];

      await this.createManuscriptAssets(version);
      const quickCheckDiscussions = await this.createQuickChecks(
        version,
        userId,
      );

      const versions = manuscriptEntry.fields.versions['en-US'];
      const lastVersion = versions[versions.length - 1];
      const lastVersionId = lastVersion.sys.id;

      const lastVersionEntry = await environment.getEntry(lastVersionId);
      await patchAndPublish(manuscriptEntry, {
        title: manuscriptData.title,
        teams: getLinkEntities(version.teams),
      });

      await patchAndPublish(lastVersionEntry, {
        ...version,
        teams: getLinkEntities(version.teams),
        labs: version?.labs?.length ? getLinkEntities(version.labs) : [],
        firstAuthors: getLinkEntities(version.firstAuthors),
        correspondingAuthor: getLinkEntities(version.correspondingAuthor),
        additionalAuthors: getLinkEntities(version.additionalAuthors),
        manuscriptFile: getLinkAsset(version.manuscriptFile.id),
        keyResourceTable: version.keyResourceTable
          ? getLinkAsset(version.keyResourceTable.id)
          : null,
        additionalFiles: version.additionalFiles?.length
          ? getLinkAssets(
              version.additionalFiles.map(
                (additionalFile) => additionalFile.id,
              ),
            )
          : null,
        updatedBy: getLinkEntity(userId),
        ...quickCheckDiscussions,
      });
    }
  }
}

const parseGraphQLManuscript = (
  manuscript: ManuscriptItem,
): ManuscriptDataObject => {
  const teamData = manuscript.teamsCollection?.items[0];

  const teamId = teamData?.teamId || '';
  const grantId = teamData?.grantId || '';
  const count = manuscript.count || 1;
  return {
    id: manuscript.sys.id,
    count,
    title: manuscript.title || '',
    teamId: teamData?.sys.id || '',
    status: manuscriptMapStatus(manuscript.status) || undefined,
    versions: parseGraphqlManuscriptVersion(
      manuscript.versionsCollection?.items || [],
      grantId,
      teamId,
      count,
    ),
  };
};

type ManuscriptVersionItem = NonNullable<
  NonNullable<
    NonNullable<FetchManuscriptByIdQuery['manuscripts']>['versionsCollection']
  >['items'][number]
>;

type FirstAuthorItem = NonNullable<
  NonNullable<ManuscriptVersionItem['firstAuthorsCollection']>['items'][number]
>;

type CorrespondingAuthorItem = NonNullable<
  NonNullable<
    ManuscriptVersionItem['correspondingAuthorCollection']
  >['items'][number]
>;

type AdditionalAuthorItem = NonNullable<
  NonNullable<
    ManuscriptVersionItem['additionalAuthorsCollection']
  >['items'][number]
>;

type ManuscriptUser = NonNullable<ManuscriptVersionItem['createdBy']>;

const parseGraphqlAuthor = (
  authorItems:
    | FirstAuthorItem[]
    | CorrespondingAuthorItem[]
    | AdditionalAuthorItem[],
) =>
  authorItems.map((author) => {
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
      };
    }

    return {
      id: author.sys.id,
      displayName: author?.name || '',
      email: author.email || '',
    };
  });

const parseGraphqlManuscriptUser = (user: ManuscriptUser | undefined) => ({
  id: user?.sys.id,
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  displayName: parseUserDisplayName(
    user?.firstName || '',
    user?.lastName || '',
    undefined,
    user?.nickname || '',
  ),
  avatarUrl: user?.avatar?.url || undefined,
  alumniSinceDate: user?.alumniSinceDate || undefined,
  teams: user?.teamsCollection?.items.map((teamItem) => ({
    id: teamItem?.team?.sys.id,
    name: teamItem?.team?.displayName,
  })),
});

export const parseGraphqlManuscriptVersion = (
  versions: NonNullable<
    NonNullable<ManuscriptItem['versionsCollection']>['items']
  >,
  teamGrantId?: string,
  teamIdCode?: string,
  manuscriptCount?: number,
): ManuscriptVersion[] =>
  versions
    .map((version) => ({
      id: version?.sys.id,
      type: version?.type,
      lifecycle: version?.lifecycle,
      description: version?.description,
      count: version?.count || 0,
      versionUID: getManuscriptVersionUID({
        version: {
          type: version?.type,
          count: version?.count,
          lifecycle: version?.lifecycle,
        },
        teamIdCode: teamIdCode || '',
        grantId: teamGrantId || '',
        manuscriptCount: manuscriptCount || 0,
      }),
      manuscriptFile: {
        url: version?.manuscriptFile?.url,
        filename: version?.manuscriptFile?.fileName,
        id: version?.manuscriptFile?.sys.id,
      },
      keyResourceTable: version?.keyResourceTable
        ? {
            url: version?.keyResourceTable?.url,
            filename: version?.keyResourceTable?.fileName,
            id: version?.keyResourceTable?.sys.id,
          }
        : undefined,
      additionalFiles: version?.additionalFilesCollection?.items.map(
        (file) => ({
          url: file?.url,
          filename: file?.fileName,
          id: file?.sys.id,
        }),
      ),
      preprintDoi: version?.preprintDoi,
      publicationDoi: version?.publicationDoi,
      requestingApcCoverage: version?.requestingApcCoverage,
      submitterName: version?.submitterName,
      submissionDate: version?.submissionDate,
      otherDetails: version?.otherDetails,
      acknowledgedGrantNumberDetails: parseQuickCheckDetails(
        version?.acknowledgedGrantNumber,
        version?.acknowledgedGrantNumberDetails,
      ),
      asapAffiliationIncludedDetails: parseQuickCheckDetails(
        version?.asapAffiliationIncluded,
        version?.asapAffiliationIncludedDetails,
      ),
      manuscriptLicenseDetails: parseQuickCheckDetails(
        version?.manuscriptLicense,
        version?.manuscriptLicenseDetails,
      ),
      datasetsDepositedDetails: parseQuickCheckDetails(
        version?.datasetsDeposited,
        version?.datasetsDepositedDetails,
      ),
      codeDepositedDetails: parseQuickCheckDetails(
        version?.codeDeposited,
        version?.codeDepositedDetails,
      ),
      protocolsDepositedDetails: parseQuickCheckDetails(
        version?.protocolsDeposited,
        version?.protocolsDepositedDetails,
      ),
      labMaterialsRegisteredDetails: parseQuickCheckDetails(
        version?.labMaterialsRegistered,
        version?.labMaterialsRegisteredDetails,
      ),
      availabilityStatementDetails: parseQuickCheckDetails(
        version?.availabilityStatement,
        version?.availabilityStatementDetails,
      ),
      createdBy: parseGraphqlManuscriptUser(version?.createdBy || undefined),
      updatedBy: parseGraphqlManuscriptUser(version?.updatedBy || undefined),
      createdDate: version?.sys.firstPublishedAt,
      publishedAt: version?.sys.publishedAt,
      teams: version?.teamsCollection?.items.map((teamItem) => ({
        id: teamItem?.sys.id,
        displayName: teamItem?.displayName,
        inactiveSince: teamItem?.inactiveSince || undefined,
      })),
      labs: version?.labsCollection?.items.map((labItem) => ({
        id: labItem?.sys.id,
        name: labItem?.name,
      })),
      complianceReport: parseComplianceReport(
        version?.linkedFrom?.complianceReportsCollection?.items[0],
        version?.count || 0,
      ),
      firstAuthors: parseGraphqlAuthor(
        (version?.firstAuthorsCollection?.items || []).filter(
          (author): author is FirstAuthorItem => author !== null,
        ),
      ),
      additionalAuthors: parseGraphqlAuthor(
        (version?.additionalAuthorsCollection?.items || []).filter(
          (author): author is AdditionalAuthorItem => author !== null,
        ),
      ),
      correspondingAuthor: parseGraphqlAuthor(
        (version?.correspondingAuthorCollection?.items || []).filter(
          (author): author is CorrespondingAuthorItem => author !== null,
        ),
      ),
    }))
    .filter(
      (version) =>
        (version &&
          version.type &&
          manuscriptTypes.includes(version.type as ManuscriptType) &&
          version.lifecycle &&
          manuscriptLifecycles.includes(
            version.lifecycle as ManuscriptLifecycle,
          )) ||
        false,
    ) as ManuscriptVersion[];

const parseComplianceReport = (
  complianceReport: ComplianceReport | undefined,
  versionCount: number,
) =>
  complianceReport && {
    id: complianceReport.sys.id,
    url: complianceReport.url,
    description: complianceReport.description,
    count: versionCount,
    createdDate: complianceReport.sys.firstPublishedAt,
    createdBy: parseGraphqlManuscriptUser(
      complianceReport.createdBy || undefined,
    ),
    discussionId: complianceReport.discussion?.sys.id,
  };
const createQuickCheckDiscussions = async (
  environment: Environment,
  quickCheckDetails: QuickCheckDetailsObject,
  userId: string,
) => {
  const generatedDiscussions = {} as Record<
    QuickCheckDetails,
    Link<'Entry'> | null
  >;
  await Promise.all(
    Object.entries(quickCheckDetails).map(
      async ([quickCheckDetail, fieldValue]) => {
        if (fieldValue) {
          const user = getLinkEntity(userId);
          const messageEntry = await environment.createEntry('messages', {
            fields: addLocaleToFields({
              text: fieldValue,
              createdBy: user,
            }),
          });

          await messageEntry.publish();

          const messageId = messageEntry.sys.id;
          const discussionEntry = await environment.createEntry('discussions', {
            fields: addLocaleToFields({
              message: getLinkEntity(messageId),
            }),
          });

          await discussionEntry.publish();

          generatedDiscussions[quickCheckDetail as QuickCheckDetails] =
            getLinkEntity(discussionEntry.sys.id);
        } else {
          generatedDiscussions[quickCheckDetail as QuickCheckDetails] = null;
        }
      },
    ),
  );
  return generatedDiscussions;
};

const parseQuickCheckDetails = (
  field: Maybe<string> | undefined,
  details: Maybe<Discussion> | undefined,
) => (field === 'No' && details ? parseGraphQLDiscussion(details) : undefined);

export const getLifecycleCode = (lifecycle: string) => {
  switch (lifecycle) {
    case 'Draft Manuscript (prior to Publication)':
      return 'G';
    case 'Preprint':
      return 'P';
    case 'Publication':
      return 'D';
    case 'Publication with addendum or corrigendum':
      return 'C';
    case 'Typeset proof':
      return 'T';
    case 'Other':
    default:
      return 'O';
  }
};

export const getManuscriptVersionUID = ({
  version,
  teamIdCode,
  grantId,
  manuscriptCount,
}: {
  version: Pick<
    NonNullable<
      NonNullable<ManuscriptListItem['versionsCollection']>['items'][number]
    >,
    'count' | 'lifecycle' | 'type'
  >;
  teamIdCode: string;
  grantId: string;
  manuscriptCount: number;
}) => {
  const manuscriptTypeCode =
    version.type === 'Original Research' ? 'org' : 'rev';

  const lifecycleCode = getLifecycleCode(version.lifecycle || '');
  return `${teamIdCode}-${grantId}-${String(manuscriptCount).padStart(
    3,
    '0',
  )}-${manuscriptTypeCode}-${lifecycleCode}-${version.count}`;
};
