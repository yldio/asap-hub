import {
  addLocaleToFields,
  Environment,
  FetchManuscriptByIdQuery,
  FetchManuscriptByIdQueryVariables,
  FetchManuscriptsByTeamIdQuery,
  FetchManuscriptsQuery,
  FetchManuscriptsQueryVariables,
  FetchManuscriptVersionCountByIdQuery,
  FetchManuscriptVersionCountByIdQueryVariables,
  FETCH_MANUSCRIPTS,
  FETCH_MANUSCRIPTS_BY_TEAM_ID,
  FETCH_MANUSCRIPT_BY_ID,
  FETCH_MANUSCRIPT_VERSION_COUNT_BY_ID,
  getLinkAsset,
  getLinkAssets,
  getLinkEntities,
  getLinkEntity,
  GraphQLClient,
  ManuscriptsFilter,
  Maybe,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import {
  FetchOptions,
  ListPartialManuscriptResponse,
  ManuscriptAssignedUser,
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  ManuscriptDiscussion,
  ManuscriptLifecycle,
  manuscriptLifecycles,
  manuscriptMapStatus,
  ManuscriptResubmitDataObject,
  ManuscriptStatus,
  ManuscriptType,
  manuscriptTypes,
  EmailTriggerAction,
  ManuscriptUpdateDataObject,
  ManuscriptVersion,
  QuickCheckDetails,
  ApcCoverageRequestStatus,
} from '@asap-hub/model';
import { parseUserDisplayName } from '@asap-hub/server-common';

import { getCommaAndString } from '../../utils/text';
import { EmailNotificationService } from '../email-notification-service';
import { ManuscriptDataProvider } from '../types';

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
  private emailNotificationService: EmailNotificationService;

  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {
    this.emailNotificationService = new EmailNotificationService(
      this.contentfulClient,
    );
  }

  async fetch(
    options: FetchOptions<ManuscriptsFilter>,
  ): Promise<ListPartialManuscriptResponse> {
    const { take = 8, skip = 0, filter = {} } = options;

    const { manuscriptsCollection } = await this.contentfulClient.request<
      FetchManuscriptsQuery,
      FetchManuscriptsQueryVariables
    >(FETCH_MANUSCRIPTS, {
      limit: take,
      skip,
      where: filter,
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
            manuscriptId: getManuscriptVersionUID({
              version: {
                type: version?.type,
                count: version?.count,
                lifecycle: version?.lifecycle,
              },
              teamIdCode: team?.teamId || '',
              grantId: team?.grantId || '',
              manuscriptCount: manuscript.count || 0,
            }),
            title: manuscript.title || '',
            url: manuscript.url || undefined,
            teams: getCommaAndString(
              (manuscript.teamsCollection?.items || []).map(
                (teamItem) => teamItem?.displayName || '',
              ),
            ),
            assignedUsers: parseGraphQLManuscriptAssignedUsers(
              manuscript.assignedUsersCollection,
            ),
            status: manuscriptMapStatus(manuscript.status) || undefined,
            id: manuscript.sys.id,
            apcRequested: manuscript.apcRequested ?? undefined,
            apcAmountRequested: manuscript.apcAmountRequested || undefined,
            apcCoverageRequestStatus:
              manuscript.apcCoverageRequestStatus as ApcCoverageRequestStatus,
            apcAmountPaid: manuscript.apcAmountPaid || undefined,
            declinedReason: manuscript.declinedReason || undefined,
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
      )[0]?.count || 0
    );
  }

  async fetchById(
    id: string,
    userId: string,
  ): Promise<ManuscriptDataObject | null> {
    const { manuscripts } = await this.contentfulClient.request<
      FetchManuscriptByIdQuery,
      FetchManuscriptByIdQueryVariables
    >(FETCH_MANUSCRIPT_BY_ID, { id, userId });

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

  private async createManuscriptVersion(
    version: ManuscriptCreateDataObject['versions'][number],
    userId: string,
    versionCount: number,
  ): Promise<string> {
    const environment = await this.getRestClient();

    await this.createManuscriptAssets(version);

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
          ...getQuickCheckDetails(version),
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
      notificationList = '',
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
        impact: getLinkEntity(input.impact || ''),
        categories: getLinkEntities(input.categories || []),
        status: 'Waiting for Report',
      }),
    });

    await manuscriptEntry.publish();

    await this.emailNotificationService.sendEmailNotification(
      'manuscript_submitted',
      manuscriptEntry.sys.id,
      notificationList,
    );

    return manuscriptEntry.sys.id;
  }

  async createVersion(
    id: string,
    input: ManuscriptResubmitDataObject,
  ): Promise<void> {
    const {
      userId,
      notificationList = '',
      versions: [version],
      url,
      title,
    } = input;

    if (!version) {
      throw new Error('No versions provided');
    }

    const environment = await this.getRestClient();
    const manuscriptEntry = await environment.getEntry(id);
    const previousVersions = manuscriptEntry.fields.versions['en-US'];

    const { manuscripts } = await this.contentfulClient.request<
      FetchManuscriptVersionCountByIdQuery,
      FetchManuscriptVersionCountByIdQueryVariables
    >(FETCH_MANUSCRIPT_VERSION_COUNT_BY_ID, { id });

    const currentVersionCount =
      manuscripts?.versionsCollection?.items[0]?.count || 0;

    const manuscriptVersionId = await this.createManuscriptVersion(
      version,
      userId,
      currentVersionCount + 1,
    );

    const newVersion = getLinkEntity(manuscriptVersionId);

    await patchAndPublish(manuscriptEntry, {
      versions: [...previousVersions, newVersion],
      title,
      url,
      teams: getLinkEntities(version.teams),
      status: 'Manuscript Resubmitted',
      impact: getLinkEntity(input.impact || ''),
      categories: getLinkEntities(input.categories || []),
    });

    await this.emailNotificationService.sendEmailNotification(
      'manuscript_resubmitted',
      id,
      notificationList,
    );
  }

  async update(
    id: string,
    manuscriptData: ManuscriptUpdateDataObject,
    userId: string,
  ): Promise<void> {
    const environment = await this.getRestClient();
    const manuscriptEntry = await environment.getEntry(id);
    let published = manuscriptEntry;

    if ('assignedUsers' in manuscriptData) {
      published = await patchAndPublish(manuscriptEntry, {
        assignedUsers: getLinkEntities(manuscriptData.assignedUsers),
      });
    }

    if ('status' in manuscriptData) {
      const previousStatus = manuscriptEntry.fields.status['en-US'];

      published = await patchAndPublish(manuscriptEntry, {
        status: manuscriptData.status,
        previousStatus,
        statusUpdatedBy: getLinkEntity(userId),
        statusUpdatedAt: new Date(),
      });
      const statusUpdateAction = getStatusUpdateAction(manuscriptData.status);
      if (statusUpdateAction) {
        const notificationList =
          'notificationList' in manuscriptData
            ? (manuscriptData.notificationList as string)
            : '';
        await this.emailNotificationService.sendEmailNotification(
          statusUpdateAction,
          id,
          notificationList,
        );
      }
    }

    if ('apcRequested' in manuscriptData) {
      published = await patchAndPublish(manuscriptEntry, {
        apcRequested: manuscriptData.apcRequested,
        apcAmountRequested: manuscriptData.apcAmountRequested,
        apcCoverageRequestStatus: manuscriptData.apcCoverageRequestStatus,
        apcAmountPaid: manuscriptData.apcAmountPaid,
        declinedReason: manuscriptData.declinedReason,
      });
    }

    if ('versions' in manuscriptData && manuscriptData.versions?.[0]) {
      const version = manuscriptData.versions[0];

      await this.createManuscriptAssets(version);

      const versions = manuscriptEntry.fields.versions['en-US'];
      const lastVersion = versions[versions.length - 1];
      const lastVersionId = lastVersion.sys.id;

      const lastVersionEntry = await environment.getEntry(lastVersionId);
      published = await patchAndPublish(manuscriptEntry, {
        title: manuscriptData.title,
        url: manuscriptData.url,
        teams: getLinkEntities(version.teams),
        impact: getLinkEntity(manuscriptData.impact || ''),
        categories: getLinkEntities(manuscriptData.categories || []),
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
        ...getQuickCheckDetails(version),
      });
    }

    const fetchManuscriptById = () =>
      this.contentfulClient.request<
        FetchManuscriptByIdQuery,
        FetchManuscriptByIdQueryVariables
      >(FETCH_MANUSCRIPT_BY_ID, { id, userId });

    await pollContentfulGql<FetchManuscriptByIdQuery>(
      published.sys.publishedVersion || Infinity,
      fetchManuscriptById,
      'manuscripts',
    );
  }
}

const parseGraphQLManuscriptAssignedUsers = (
  assignedUsersCollection?:
    | NonNullable<
        NonNullable<
          FetchManuscriptsQuery['manuscriptsCollection']
        >['items'][number]
      >['assignedUsersCollection']
    | NonNullable<
        NonNullable<FetchManuscriptByIdQuery['manuscripts']>
      >['assignedUsersCollection'],
): ManuscriptAssignedUser[] =>
  assignedUsersCollection?.items.map((user) => ({
    id: user?.sys.id || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    avatarUrl: user?.avatar?.url || '',
  })) || [];

const parseGraphQLManuscriptDiscussions = (
  discussionItems:
    | NonNullable<NonNullable<ManuscriptItem['discussionsCollection']>['items']>
    | undefined,
): ManuscriptDiscussion[] => {
  if (!discussionItems) return [];

  const discussionsData = discussionItems.map((discussion) => {
    const replies =
      discussion?.repliesCollection?.items.map((reply) => ({
        text: reply?.text || '',
        createdBy: parseGraphqlManuscriptUser(reply?.createdBy || undefined),
        createdDate: reply?.sys.publishedAt,
      })) || [];

    const createdDate = discussion?.message?.sys.publishedAt;
    const lastUpdatedAt =
      replies
        .map((item) => item.createdDate)
        .filter((date): date is string => date !== undefined)
        .sort()
        .pop() || createdDate;

    return {
      id: discussion?.sys.id || '',
      title: discussion?.title || '',
      createdBy: parseGraphqlManuscriptUser(
        discussion?.message?.createdBy || undefined,
      ),
      createdDate,
      lastUpdatedAt,
      text: discussion?.message?.text || '',
      read: discussion?.readByCollection?.total === 1,
      replies,
    };
  });

  return discussionsData.sort(
    (a, b) =>
      new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime(),
  );
};
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
    url: manuscript.url || undefined,
    teamId: teamData?.sys.id || '',
    status: manuscriptMapStatus(manuscript.status) || undefined,
    discussions: parseGraphQLManuscriptDiscussions(
      manuscript.discussionsCollection?.items,
    ),
    assignedUsers: parseGraphQLManuscriptAssignedUsers(
      manuscript.assignedUsersCollection,
    ),
    apcRequested: manuscript.apcRequested ?? undefined,
    apcAmountRequested: manuscript.apcAmountRequested || undefined,
    apcCoverageRequestStatus:
      manuscript.apcCoverageRequestStatus as ApcCoverageRequestStatus,
    apcAmountPaid: manuscript.apcAmountPaid || undefined,
    declinedReason: manuscript.declinedReason || undefined,
    versions: parseGraphqlManuscriptVersion(
      manuscript.versionsCollection?.items || [],
      grantId,
      teamId,
      count,
    ),
    impact:
      manuscript.impact && manuscript.impact.name
        ? {
            id: manuscript.impact.sys.id,
            name: manuscript.impact.name,
          }
        : undefined,
    categories: (manuscript.categoriesCollection?.items || [])
      .filter(
        (category): category is { sys: { id: string }; name: string } =>
          !!category &&
          !!category.sys?.id &&
          typeof category.name === 'string' &&
          !!category.name,
      )
      .map((category) => ({
        id: category.sys.id,
        name: category.name,
      })),
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
        teams:
          author.teamsCollection?.items.map((teamItem) => ({
            id: teamItem?.team?.sys.id || '',
          })) || [],
      };
    }

    return {
      id: author.sys.id,
      displayName: author?.name || '',
      email: author.email || '',
    };
  });

const parseGraphqlManuscriptUser = (user: ManuscriptUser | undefined) => ({
  id: user?.sys.id || '',
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
  teams:
    user?.teamsCollection?.items.map((teamItem) => ({
      id: teamItem?.team?.sys.id || '',
      name: teamItem?.team?.displayName || '',
    })) || [],
});

const getQuickCheckDetails = (
  version: Pick<
    ManuscriptCreateDataObject['versions'][number],
    QuickCheckDetails
  >,
) => ({
  asapAffiliationIncludedDetails:
    version.asapAffiliationIncludedDetails || null,
  acknowledgedGrantNumberDetails:
    version.acknowledgedGrantNumberDetails || null,
  availabilityStatementDetails: version.availabilityStatementDetails || null,
  codeDepositedDetails: version.codeDepositedDetails || null,
  datasetsDepositedDetails: version.datasetsDepositedDetails || null,
  labMaterialsRegisteredDetails: version.labMaterialsRegisteredDetails || null,
  manuscriptLicenseDetails: version.manuscriptLicenseDetails || null,
  protocolsDepositedDetails: version.protocolsDepositedDetails || null,
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
      shortDescription: version?.shortDescription,
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
      otherDetails: version?.otherDetails,
      acknowledgedGrantNumber: version?.acknowledgedGrantNumber,
      asapAffiliationIncluded: version?.asapAffiliationIncluded,
      manuscriptLicense: version?.manuscriptLicense,
      datasetsDeposited: version?.datasetsDeposited,
      codeDeposited: version?.codeDeposited,
      protocolsDeposited: version?.protocolsDeposited,
      labMaterialsRegistered: version?.labMaterialsRegistered,
      availabilityStatement: version?.availabilityStatement,
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
        labPi: labItem?.labPi?.sys.id,
        labPITeamIds: labItem?.labPi?.teamsCollection?.items.reduce(
          (teamIds: string[], team) => {
            const isInactive =
              !!team?.inactiveSinceDate || !!team?.team?.inactiveSince;
            if (!isInactive && team?.team?.sys?.id) {
              teamIds.push(team.team.sys.id);
            }
            return teamIds;
          },
          [],
        ),
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
  };

const parseQuickCheckDetails = (
  field: Maybe<string> | undefined,
  details: Maybe<string> | undefined,
) => (field === 'No' || field === 'Not applicable' ? details : undefined);

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

const getStatusUpdateAction = (
  status: ManuscriptStatus | undefined,
): EmailTriggerAction | null => {
  switch (status) {
    case 'Review Compliance Report':
      return 'status_changed_review_compliance_report';
    case 'Submit Final Publication':
      return 'status_changed_submit_final_publication';
    case 'Addendum Required':
      return 'status_changed_addendum_required';
    case 'Compliant':
      return 'status_changed_compliant';
    case 'Closed (other)':
      return 'status_changed_closed_other';
    default:
      return null;
  }
};
