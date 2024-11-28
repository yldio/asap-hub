import {
  addLocaleToFields,
  Environment,
  FetchManuscriptByIdQuery,
  FetchManuscriptByIdQueryVariables,
  FetchManuscriptsByTeamIdQuery,
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
  ListResponse,
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

  async fetch(): Promise<ListResponse<ManuscriptDataObject>> {
    throw new Error('Method not implemented.');
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
        teams: getLinkEntities([teamId]),
        versions: getLinkEntities([manuscriptVersionId]),
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
      await patchAndPublish(manuscriptEntry, {
        status: manuscriptData.status,
      });
    }

    if ('versions' in manuscriptData && manuscriptData.versions?.[0]) {
      const version = manuscriptData.versions[0];

      await this.createManuscriptAssets(version);
      const quickCheckDiscussions = await this.createQuickChecks(
        version,
        userId,
      );

      const versionId = manuscriptEntry.fields.versions['en-US'][0].sys.id;

      const versionEntry = await environment.getEntry(versionId);
      await patchAndPublish(manuscriptEntry, {
        title: manuscriptData.title,
      });

      await patchAndPublish(versionEntry, {
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
  manuscripts: ManuscriptItem,
): ManuscriptDataObject => ({
  id: manuscripts.sys.id,
  count: manuscripts.count || 0,
  title: manuscripts.title || '',
  teamId: manuscripts.teamsCollection?.items[0]?.sys.id || '',
  status: manuscriptMapStatus(manuscripts.status) || undefined,
  versions: parseGraphqlManuscriptVersion(
    manuscripts.versionsCollection?.items || [],
  ),
});

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

export const parseGraphqlManuscriptVersion = (
  versions: NonNullable<
    NonNullable<ManuscriptItem['versionsCollection']>['items']
  >,
): ManuscriptVersion[] =>
  versions
    .map((version) => ({
      id: version?.sys.id,
      type: version?.type,
      lifecycle: version?.lifecycle,
      description: version?.description,
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
      createdBy: {
        id: version?.createdBy?.sys.id,
        firstName: version?.createdBy?.firstName || '',
        lastName: version?.createdBy?.lastName || '',
        displayName: parseUserDisplayName(
          version?.createdBy?.firstName || '',
          version?.createdBy?.lastName || '',
          undefined,
          version?.createdBy?.nickname || '',
        ),
        avatarUrl: version?.createdBy?.avatar?.url || undefined,
        alumniSinceDate: version?.createdBy?.alumniSinceDate || undefined,
        teams: version?.createdBy?.teamsCollection?.items.map((teamItem) => ({
          id: teamItem?.team?.sys.id,
          name: teamItem?.team?.displayName,
        })),
      },
      updatedBy: {
        id: version?.updatedBy?.sys.id || '',
        firstName: version?.updatedBy?.firstName || '',
        lastName: version?.updatedBy?.lastName || '',
        displayName: parseUserDisplayName(
          version?.updatedBy?.firstName || '',
          version?.updatedBy?.lastName || '',
          undefined,
          version?.updatedBy?.nickname || '',
        ),
        avatarUrl: version?.updatedBy?.avatar?.url || undefined,
        alumniSinceDate: version?.updatedBy?.alumniSinceDate || undefined,
        teams: version?.updatedBy?.teamsCollection?.items.map((teamItem) => ({
          id: teamItem?.team?.sys.id,
          name: teamItem?.team?.displayName,
        })),
      },
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
) =>
  complianceReport && {
    url: complianceReport.url,
    description: complianceReport.description,
    count: complianceReport.count,
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
