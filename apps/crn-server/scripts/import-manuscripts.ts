import {
  addLocaleToFields,
  Environment,
  getGraphQLClient as getContentfulGraphQLClient,
  getLinkEntity,
  patchAndPublish,
} from '@asap-hub/contentful';
import {
  ManuscriptCreateDataObject,
  ManuscriptLifecycle,
  ManuscriptResubmitDataObject,
  ManuscriptType,
} from '@asap-hub/model';
import { parse } from '@asap-hub/server-common';
import { RateLimiter } from 'limiter';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { AssetContentfulDataProvider } from '../src/data-providers/contentful/asset.data-provider';
import { ManuscriptContentfulDataProvider } from '../src/data-providers/contentful/manuscript.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependencies';

type ManuscriptVersionImport = {
  originalVersionId: string;
  manuscriptType: ManuscriptType;
  manuscriptLifecycle: ManuscriptLifecycle;
  manuscriptVersion: number;
  versionDoiPreprint?: string;
  versionDoiPublication?: string;
  manuscriptStatus: string;
  manuscriptFirstAuthor: string;
  sharedData?: string;
  sharedCode?: string;
  sharedProtocols?: string;
  sharedMaterials?: string;
  krt?: string; //url to key resource table
  dsMostRecent?: string;
  teamId1: string;
  teamId2?: string;
  teamId3?: string;
  labId?: string;
  authorId: string;
  pdfLink: string;
};

type ManuscriptImport = {
  manuscriptTitle: string;
  manuscriptNumber: number;
  apcAmount: number;
  apcStatus: boolean;
  staffResponsibleId: string;
  versions: ManuscriptVersionImport[];
};

console.log('Importing manuscripts...');

const rateLimiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: 5000,
});

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const manuscriptDataProvider = new ManuscriptContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

const assetContentfulDataProvider = new AssetContentfulDataProvider(
  getContentfulRestClientFactory,
);

const mapManuscriptType = (type: string) => {
  return type === 'org'
    ? 'Original Research'
    : 'Review / Op-Ed / Letter / Hot Topic';
};

const mapManuscriptLifecycle = (lifecycle: string) => {
  switch (lifecycle) {
    case 'G':
      return 'Draft Manuscript (prior to Publication)';
    case 'P':
      return 'Preprint';
    case 'D':
      return 'Publication';
    case 'C':
      return 'Publication with addendum or corrigendum';
    case 'T':
      return 'Typeset proof';
    case 'O':
    default:
      return 'Other';
  }
};

const mapManuscriptStatus = (status: string) => {
  switch (status) {
    case 'Waiting for Report':
      return 'Waiting for Report';
    case 'Review Compliance Report':
      return 'Review Compliance Report';
    case 'Manuscript Re-Submitted':
      return 'Manuscript Resubmitted';
    case 'Closed (Other)':
      return 'Closed (other)';
    default:
      return undefined;
  }
};

const mapApcPaid = (apcPaid: string) => {
  return apcPaid === 'Paid';
};

const mapQuickCheck = (quickCheck: string) => {
  switch (quickCheck) {
    case 'yes':
      return 'Yes';
    case 'no':
      return 'No';
    case 'NA':
      return 'Not applicable';
    default:
      return undefined;
  }
};

const mapQuickCheckDetails = (quickCheck: string | undefined) => {
  switch (quickCheck) {
    case 'No':
      return 'Output has not yet been shared in compliance with the ASAP Open Science Policy';
    case 'Not applicable':
      return 'The present study did not produce this output type';
    default:
      return undefined;
  }
};

const getDownloadableLinkFromGoogleDriveUrl = (url: string) => {
  // example: https://drive.google.com/file/d/<FILE_ID>/view?usp=drive_link
  if (url.startsWith('https://drive.google.com')) {
    return url.replace(
      /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=.*/g,
      'https://drive.google.com/uc?export=download&id=$1',
    );
  }

  // example: https://docs.google.com/spreadsheets/d/<FILE_ID>/edit?usp=sharing
  if (url.startsWith('https://docs.google.com/spreadsheets/')) {
    return url.replace(
      /https:\/\/docs\.google\.com\/spreadsheets\/d\/(.*?)\/.*?\?usp=.*/g,
      'https://docs.google.com/spreadsheets/d/$1/export?format=xlsx',
    );
  }

  //ignoring zenodo links as we don't know what to do with them
  return null;
};

const createAsset = async (
  originalVersionId: string,
  url: string,
  type: 'manuscript_file' | 'krt',
) => {
  await rateLimiter.removeTokens(5);
  if (type === 'manuscript_file') {
    console.log(url);
    return await assetContentfulDataProvider.createFromUrl({
      id: '',
      fileType: 'application/pdf',
      url,
      filename: `${originalVersionId} - Manuscript File`,
      publish: true,
    });
  }
  if (url.startsWith('https://docs.google.com/spreadsheets/')) {
    console.log(url);
    return await assetContentfulDataProvider.createFromUrl({
      id: '',
      url,
      filename: `${originalVersionId} - KRT.xlsx`,
      publish: true,
    });
  } else {
    console.log(url);
    return await assetContentfulDataProvider.createFromUrl({
      id: '',
      fileType: 'text/csv',
      url,
      filename: `${originalVersionId} - KRT`,
      publish: true,
    });
  }
};

const getFirstAuthorId = async (
  environment: Environment,
  authorId: string,
  authorName: string,
) => {
  if (!authorId.includes('@')) {
    return authorId;
  } else {
    const existingExternalAuthors = await environment.getEntries({
      content_type: 'externalAuthors',
      'fields.name[in]': authorName,
      'fields.email[in]': authorId,
    });
    if (existingExternalAuthors.items.length !== 1) {
      const newExternalAuthor = await environment.createEntry(
        'externalAuthors',
        {
          fields: {
            ...addLocaleToFields({
              name: authorName,
            }),
          },
        },
      );

      await newExternalAuthor.publish();
      return newExternalAuthor.sys.id;
    }
    return existingExternalAuthors.items[0]?.sys.id;
  }
};

const updateManuscriptVersion = async (
  environment: Environment,
  manuscriptId: string,
  version: ManuscriptVersionImport,
) => {
  await rateLimiter.removeTokens(5);

  const manuscriptEntry = await environment.getEntry(manuscriptId);
  const manuscriptVersionId =
    manuscriptEntry.fields.versions['en-US'].at(-1).sys.id;

  const manuscriptVersionEntry =
    await environment.getEntry(manuscriptVersionId);

  await patchAndPublish(manuscriptVersionEntry, {
    originalVersionId: version.originalVersionId,
    createdBy: null,
    updatedBy: null,
  });

  if (version.dsMostRecent) {
    await rateLimiter.removeTokens(5);
    const complianceReport = await environment.createEntry(
      'complianceReports',
      {
        fields: {
          ...addLocaleToFields({
            url: version.dsMostRecent,
            description:
              'See compliance report previously emailed from openscience@parkinsonsroadmap.org',
            manuscriptVersion: getLinkEntity(manuscriptVersionId),
          }),
        },
      },
    );

    await complianceReport.publish();
  }
};

const parseManuscriptVersion = async (
  environment: Environment,
  versionImport: ManuscriptVersionImport,
): Promise<ManuscriptCreateDataObject['versions'][number]> => {
  await rateLimiter.removeTokens(5);
  const firstAuthorId = await getFirstAuthorId(
    environment,
    versionImport.authorId,
    versionImport.manuscriptFirstAuthor,
  );

  return {
    type: versionImport.manuscriptType,
    lifecycle: versionImport.manuscriptLifecycle,
    preprintDoi: versionImport.versionDoiPreprint || undefined,
    publicationDoi: versionImport.versionDoiPublication || undefined,
    description: 'imported manuscript version',
    manuscriptFile: await createAsset(
      versionImport.originalVersionId,
      versionImport.pdfLink,
      'manuscript_file',
    ),
    datasetsDeposited: versionImport.sharedData,
    datasetsDepositedDetails: mapQuickCheckDetails(versionImport.sharedData),
    codeDeposited: versionImport.sharedCode,
    codeDepositedDetails: mapQuickCheckDetails(versionImport.sharedCode),
    protocolsDeposited: versionImport.sharedProtocols,
    protocolsDepositedDetails: mapQuickCheckDetails(
      versionImport.sharedProtocols,
    ),
    labMaterialsRegistered: versionImport.sharedMaterials,
    labMaterialsRegisteredDetails: mapQuickCheckDetails(
      versionImport.sharedMaterials,
    ),
    teams: [
      versionImport.teamId1,
      ...(versionImport.teamId2 ? [versionImport.teamId2] : []),
      ...(versionImport.teamId3 ? [versionImport.teamId3] : []),
    ],
    labs: [...(versionImport.labId ? [versionImport.labId] : [])],
    firstAuthors: [...(firstAuthorId ? [firstAuthorId] : [])],
    correspondingAuthor: [],
    additionalAuthors: [],
    keyResourceTable: versionImport.krt
      ? await createAsset(
          versionImport.originalVersionId,
          versionImport.krt,
          'krt',
        )
      : undefined,
  };
};

const createManuscript = async (
  teamId: string,
  manuscript: ManuscriptImport,
) => {
  const [firstVersion, ...otherVersions] = manuscript.versions.sort(
    (a, b) => a.manuscriptVersion - b.manuscriptVersion,
  );
  const currentStatus =
    manuscript.versions.length === 1
      ? firstVersion!.manuscriptStatus
      : otherVersions.at(-1)!.manuscriptStatus;
  console.log(currentStatus);
  const environment = await getContentfulRestClientFactory();

  const manuscriptCreateObject: ManuscriptCreateDataObject = {
    title: manuscript.manuscriptTitle,
    teamId,
    userId: '3az05EiV3vJcY0BYlaRdGU',
    eligibilityReasons: [],
    versions: [await parseManuscriptVersion(environment, firstVersion!)],
  };

  await rateLimiter.removeTokens(5);

  const manuscriptId = await manuscriptDataProvider.create(
    manuscriptCreateObject,
  );

  const manuscriptEntry = await environment.getEntry(manuscriptId);

  await patchAndPublish(manuscriptEntry, {
    apcPaid: manuscript.apcStatus,
    apcAmount: manuscript.apcAmount,
    assignedUsers: [getLinkEntity(manuscript.staffResponsibleId)],
    status: currentStatus,
  });

  await updateManuscriptVersion(environment, manuscriptId, firstVersion!);

  for (const version of otherVersions) {
    await rateLimiter.removeTokens(5);
    const parsedVersion: ManuscriptResubmitDataObject = {
      title: manuscript.manuscriptTitle,
      teamId,
      userId: '3az05EiV3vJcY0BYlaRdGU',
      versions: [await parseManuscriptVersion(environment, version!)],
    };

    await manuscriptDataProvider.createVersion(manuscriptId, parsedVersion);
    await updateManuscriptVersion(environment, manuscriptId, version);
  }
};

const app = async () => {
  let parseResult = {};
  const args = process.argv.slice(2);

  if (typeof args[0] !== 'string') {
    throw new Error('Please provide a path to the CSV file');
  }
  const filePath = args[0];

  console.log(filePath);
  console.log('Contentful Environment', contentfulEnvId);
  console.log('Contentful Space Id', contentfulSpaceId);

  const parseManuscriptsFromCSV = parse(
    (input: string[]) => {
      const row = input.map((s: string) => s.trim());

      const manuscriptTitle: string = row[0] || '';
      const originalVersionId: string = row[1] || '';
      // 2 - guiUrl,
      // 3 - urlManuscript,
      // 4 - team1,
      // 5 - team2,
      // 6 - team3,
      // 7 - crnRound,
      const manuscriptNumber: number = Number(row[8]); //nPaper
      const manuscriptType: string = mapManuscriptType(row[9] || ''); //type
      const manuscriptLifecycle: string = mapManuscriptLifecycle(row[10] || ''); // lifecycle
      const manuscriptVersion: number = Number(row[11]);
      const versionDoiPreprint: string | undefined = row[12];
      const versionDoiPublication: string | undefined = row[13];
      // 14 - dateAddedToComplianceTracker,
      // 15 - dateSubmitedToDataseer,
      // 16 - datePreprint,
      // 17 - datePublication,
      const manuscriptStatus: string | undefined = mapManuscriptStatus(row[18] || '');
      // 19 - staffResponsible,
      const manuscriptFirstAuthor: string = row[20] || '';
      // 21 - lab,
      const sharedData: string | undefined = mapQuickCheck(row[22] || '');
      const sharedCode: string | undefined = mapQuickCheck(row[23] || '');
      const sharedProtocols: string | undefined = mapQuickCheck(row[24] || '');
      const sharedMaterials: string | undefined = mapQuickCheck(row[25] || '');
      const krt: string | null = getDownloadableLinkFromGoogleDriveUrl(row[26] || '');
      // const krt = getDownloadableLinkFromGoogleDriveUrl(getTestKRTUrl(row[27] || ''));
      const dsMostRecent: string | undefined = row[27]; //ds_most_recent_url
      const apcAmount: number = Number(row[28] || 0);
      const apcStatus: boolean = mapApcPaid(row[29] || '');
      const teamId1: string = row[30] || '';
      const teamId2: string | undefined = row[31];
      const teamId3: string | undefined = row[32];
      const labId: string | undefined = row[33];
      const staffResponsibleId: string | undefined = row[34];
      // 35 - email
      const authorId: string = row[36] || '';
      const pdfLink: string | null = getDownloadableLinkFromGoogleDriveUrl(row[37] || '');
      console.log(pdfLink);
      //const pdfLink = getDownloadableLinkFromGoogleDriveUrl(TEST_PDF);
      return {
        manuscriptTitle,
        originalVersionId,
        manuscriptNumber,
        manuscriptType,
        manuscriptLifecycle,
        manuscriptVersion,
        versionDoiPreprint,
        versionDoiPublication,
        manuscriptStatus,
        manuscriptFirstAuthor, // only used for external authors (ignore email provided on authorId column)
        sharedData, // version.datasetsDeposited - Yes; No; Not applicable
        sharedCode, // version.codeDeposited - Yes; No; Not applicable
        sharedProtocols, // version.protocolsDeposited - Yes; No; Not applicable
        sharedMaterials, // version.labMaterialsRegistered - Yes; No; Not applicable
        krt,
        dsMostRecent,
        apcAmount,
        apcStatus,
        teamId1,
        teamId2,
        teamId3,
        labId,
        staffResponsibleId, // assigned OS team member
        authorId, // ignore emails as they're from PMs and not external authors
        pdfLink, // manuscript file
      };
    },
    async ({
      manuscriptTitle,
      originalVersionId,
      manuscriptNumber,
      manuscriptType,
      manuscriptLifecycle,
      manuscriptVersion,
      versionDoiPreprint,
      versionDoiPublication,
      manuscriptStatus,
      manuscriptFirstAuthor,
      sharedData,
      sharedCode,
      sharedProtocols,
      sharedMaterials,
      krt,
      dsMostRecent,
      apcAmount,
      apcStatus,
      teamId1,
      teamId2,
      teamId3,
      labId,
      staffResponsibleId,
      authorId,
      pdfLink,
    }) => {
      if ((parseResult as any)[teamId1]) {
        if ((parseResult as any)[teamId1][manuscriptNumber]) {
          parseResult = {
            ...parseResult,
            [teamId1]: {
              ...(parseResult as any)[teamId1],
              [manuscriptNumber]: {
                ...(parseResult as any)[teamId1][manuscriptNumber],
                versions: (parseResult as any)[teamId1][
                  manuscriptNumber
                ].versions.concat([
                  {
                    originalVersionId,
                    manuscriptType,
                    manuscriptLifecycle,
                    manuscriptVersion,
                    versionDoiPreprint,
                    versionDoiPublication,
                    manuscriptStatus,
                    manuscriptFirstAuthor,
                    sharedData,
                    sharedCode,
                    sharedProtocols,
                    sharedMaterials,
                    krt,
                    dsMostRecent,
                    teamId1,
                    teamId2,
                    teamId3,
                    labId,
                    authorId,
                    pdfLink,
                  },
                ]),
              },
            },
          };
        } else {
          parseResult = {
            ...parseResult,
            [teamId1]: {
              ...(parseResult as any)[teamId1],
              [manuscriptNumber]: {
                manuscriptTitle,
                manuscriptNumber,
                apcAmount,
                apcStatus,
                staffResponsibleId,
                versions: [
                  {
                    originalVersionId,
                    manuscriptType,
                    manuscriptLifecycle,
                    manuscriptVersion,
                    versionDoiPreprint,
                    versionDoiPublication,
                    manuscriptStatus,
                    manuscriptFirstAuthor,
                    sharedData,
                    sharedCode,
                    sharedProtocols,
                    sharedMaterials,
                    krt,
                    dsMostRecent,
                    teamId1,
                    teamId2,
                    teamId3,
                    labId,
                    authorId,
                    pdfLink,
                  },
                ],
              },
            },
          };
        }
      } else {
        (parseResult as any)[teamId1] = {
          [manuscriptNumber]: {
            manuscriptTitle,
            manuscriptNumber,
            apcAmount,
            apcStatus,
            staffResponsibleId,
            versions: [
              {
                originalVersionId,
                manuscriptType,
                manuscriptLifecycle,
                manuscriptVersion,
                versionDoiPreprint,
                versionDoiPublication,
                manuscriptStatus,
                manuscriptFirstAuthor,
                sharedData,
                sharedCode,
                sharedProtocols,
                sharedMaterials,
                krt,
                dsMostRecent,
                teamId1,
                teamId2,
                teamId3,
                labId,
                authorId,
                pdfLink,
              },
            ],
          },
        };
      }
    },
  );

  await parseManuscriptsFromCSV(filePath);

  for (const [teamId, teamManuscripts] of Object.entries(parseResult)) {
    for (const [_, manuscript] of Object.entries(teamManuscripts as any)) {
      await createManuscript(teamId, manuscript as ManuscriptImport);
    }
  }
};

app().catch(console.error);
