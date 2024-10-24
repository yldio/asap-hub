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
} from '@asap-hub/contentful';
import {
  ListResponse,
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  ManuscriptLifecycle,
  manuscriptLifecycles,
  manuscriptMapStatus,
  ManuscriptType,
  manuscriptTypes,
  ManuscriptVersion,
  QuickCheckDetails,
  QuickCheckDetailsObject,
} from '@asap-hub/model';
import { parseUserDisplayName } from '@asap-hub/server-common';

import { ManuscriptDataProvider } from '../types';

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

    const createdDiscussions = await createQuickCheckDiscussions(
      environment,
      quickCheckDetails,
      userId,
    );
    const quickCheckDiscussions =
      parseQuickCheckDiscussions(createdDiscussions);

    const manuscriptVersionEntry = await environment.createEntry(
      'manuscriptVersions',
      {
        fields: addLocaleToFields({
          ...version,
          count: 1,
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
          ...quickCheckDiscussions,
        }),
      },
    );

    await manuscriptVersionEntry.publish();

    const { id: manuscriptVersionId } = manuscriptVersionEntry.sys;

    const currentCount = (await this.fetchCountByTeamId(teamId)) || 0;

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
      acknowledgedGrantNumberDetails:
        version?.acknowledgedGrantNumber === 'No'
          ? version?.acknowledgedGrantNumberDetails?.message?.text
          : undefined,
      asapAffiliationIncludedDetails:
        version?.asapAffiliationIncluded === 'No'
          ? version?.asapAffiliationIncludedDetails?.message?.text
          : undefined,
      manuscriptLicenseDetails:
        version?.manuscriptLicense === 'No'
          ? version?.manuscriptLicenseDetails?.message?.text
          : undefined,
      datasetsDepositedDetails:
        version?.datasetsDeposited === 'No'
          ? version?.datasetsDepositedDetails?.message?.text
          : undefined,
      codeDepositedDetails:
        version?.codeDeposited === 'No'
          ? version?.codeDepositedDetails?.message?.text
          : undefined,
      protocolsDepositedDetails:
        version?.protocolsDeposited === 'No'
          ? version?.protocolsDepositedDetails?.message?.text
          : undefined,
      labMaterialsRegisteredDetails:
        version?.labMaterialsRegistered === 'No'
          ? version?.labMaterialsRegisteredDetails?.message?.text
          : undefined,
      availabilityStatementDetails:
        version?.availabilityStatement === 'No'
          ? version?.availabilityStatementDetails?.message?.text
          : undefined,
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
  };

const parseQuickCheckDiscussions = (
  quickCheckDetails: QuickCheckDetailsObject,
) => ({
  acknowledgedGrantNumberDetails:
    quickCheckDetails.acknowledgedGrantNumberDetails
      ? getLinkEntity(quickCheckDetails.acknowledgedGrantNumberDetails)
      : null,
  asapAffiliationIncludedDetails:
    quickCheckDetails.asapAffiliationIncludedDetails
      ? getLinkEntity(quickCheckDetails.asapAffiliationIncludedDetails)
      : null,
  availabilityStatementDetails: quickCheckDetails.availabilityStatementDetails
    ? getLinkEntity(quickCheckDetails.availabilityStatementDetails)
    : null,
  codeDepositedDetails: quickCheckDetails.codeDepositedDetails
    ? getLinkEntity(quickCheckDetails.codeDepositedDetails)
    : null,
  datasetsDepositedDetails: quickCheckDetails.datasetsDepositedDetails
    ? getLinkEntity(quickCheckDetails.datasetsDepositedDetails)
    : null,
  labMaterialsRegisteredDetails: quickCheckDetails.labMaterialsRegisteredDetails
    ? getLinkEntity(quickCheckDetails.labMaterialsRegisteredDetails)
    : null,
  manuscriptLicenseDetails: quickCheckDetails.manuscriptLicenseDetails
    ? getLinkEntity(quickCheckDetails.manuscriptLicenseDetails)
    : null,
  protocolsDepositedDetails: quickCheckDetails.protocolsDepositedDetails
    ? getLinkEntity(quickCheckDetails.protocolsDepositedDetails)
    : null,
});

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
