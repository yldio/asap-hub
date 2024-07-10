import {
  addLocaleToFields,
  Environment,
  FetchManuscriptByIdQuery,
  FetchManuscriptByIdQueryVariables,
  FETCH_MANUSCRIPT_BY_ID,
  getLinkAsset,
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
  ManuscriptType,
  manuscriptTypes,
  ManuscriptVersion,
} from '@asap-hub/model';
import { parseUserDisplayName } from '@asap-hub/server-common';

import { ManuscriptDataProvider } from '../types';

type ManuscriptItem = NonNullable<FetchManuscriptByIdQuery['manuscripts']>;

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

    const manuscriptVersionEntry = await environment.createEntry(
      'manuscriptVersions',
      {
        fields: addLocaleToFields({
          ...version,
          manuscriptFile: getLinkAsset(version.manuscriptFile.id),
          createdBy: getLinkEntity(userId),
        }),
      },
    );

    await manuscriptVersionEntry.publish();

    const { id: manuscriptVersionId } = manuscriptVersionEntry.sys;

    const manuscriptEntry = await environment.createEntry('manuscripts', {
      fields: addLocaleToFields({
        ...plainFields,
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
  title: manuscripts.title || '',
  teamId: manuscripts.teamsCollection?.items[0]?.sys.id || '',
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
      type: version?.type,
      lifecycle: version?.lifecycle,
      manuscriptFile: {
        url: version?.manuscriptFile?.url,
        filename: version?.manuscriptFile?.fileName,
        id: version?.manuscriptFile?.sys.id,
      },
      preprintDoi: version?.preprintDoi,
      publicationDoi: version?.publicationDoi,
      requestingApcCoverage: version?.requestingApcCoverage,
      otherDetails: version?.otherDetails,
      acknowledgedGrantNumberDetails:
        version?.acknowledgedGrantNumber === 'No'
          ? version?.acknowledgedGrantNumberDetails
          : undefined,
      asapAffiliationIncludedDetails:
        version?.asapAffiliationIncluded === 'No'
          ? version?.asapAffiliationIncludedDetails
          : undefined,
      manuscriptLicenseDetails:
        version?.manuscriptLicense === 'No'
          ? version?.manuscriptLicenseDetails
          : undefined,
      datasetsDepositedDetails:
        version?.datasetsDeposited === 'No'
          ? version?.datasetsDepositedDetails
          : undefined,
      codeDepositedDetails:
        version?.codeDeposited === 'No'
          ? version?.codeDepositedDetails
          : undefined,
      protocolsDepositedDetails:
        version?.protocolsDeposited === 'No'
          ? version?.protocolsDepositedDetails
          : undefined,
      labMaterialsRegisteredDetails:
        version?.labMaterialsRegistered === 'No'
          ? version?.labMaterialsRegisteredDetails
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
      publishedAt: version?.sys.publishedAt,
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
