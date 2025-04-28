// import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { parse } from '@asap-hub/server-common';
// import csvParse from 'csv-parse';
// import { RateLimiter } from 'limiter';
import {
  // contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { AssetContentfulDataProvider } from '../src/data-providers/contentful/asset.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependencies';

console.log('Importing manuscripts...');

// const contentfulGraphQLClient = getContentfulGraphQLClient({
//   space: contentfulSpaceId,
//   accessToken: contentfulAccessToken,
//   environment: contentfulEnvId,
// });

const assetContentfulDataProvider = new AssetContentfulDataProvider(
  getContentfulRestClientFactory,
);

export const writeAssetsExample = async () => {
  // all drive links need to be transformed into something like the following
  // From: https://drive.google.com/file/d/1z9vGIsiVgET5fLIBtKg5M1-LNUhku3_f/view?usp=drive_link
  // To: https://drive.google.com/uc?export=download&id=1z9vGIsiVgET5fLIBtKg5M1-LNUhku3_f
  // Find the file id and replace in the following URL
  // https://drive.google.com/uc?export=download&id=<file_id>

  // pdf example
  // https://drive.google.com/file/d/1z9vGIsiVgET5fLIBtKg5M1-LNUhku3_f/view?usp=drive_link
  // fileType: 'application/pdf',

  // spreedsheet example
  // https://docs.google.com/spreadsheets/d/1IKSNR4Uzlw05hrq9ociWvNe7c9btX06cyIAWzw_aaFY/edit?usp=sharing
  // fileType: 'application/vnd.ms-excel',

  // csv example
  // https://drive.google.com/file/d/1fNd48XBNnPH-szuxW1INhPQm5253j9cl/view?usp=drive_link
  // fileType: 'text/csv',

  const testMappingUrlPdf = getDownloadableLinkFromGoogleDriveUrl(
    'https://drive.google.com/file/d/1z9vGIsiVgET5fLIBtKg5M1-LNUhku3_f/view?usp=drive_link',
  );

  const testMappingUrlCsv = getDownloadableLinkFromGoogleDriveUrl(
    'https://drive.google.com/file/d/1fNd48XBNnPH-szuxW1INhPQm5253j9cl/view?usp=drive_link',
  );

  const testMappingUrlSpreadsheet = getDownloadableLinkFromGoogleDriveUrl(
    'https://docs.google.com/spreadsheets/d/1IKSNR4Uzlw05hrq9ociWvNe7c9btX06cyIAWzw_aaFY/edit?usp=sharing',
  );

  // console.log('URL =>', testMappingUrlPdf);
  // console.log('URL =>', testMappingUrlCsv);
  // console.log('URL =>', testMappingUrlSpreadsheet);

  const assetPdf = await assetContentfulDataProvider.createFromUrl({
    id: '',
    fileType: 'application/pdf',
    url: testMappingUrlPdf!,
    filename: 'Test Public PDF on drive',
    publish: true,
  });
  console.log(assetPdf.id);

  const assetCsv = await assetContentfulDataProvider.createFromUrl({
    id: '',
    fileType: 'text/csv',
    url: testMappingUrlCsv!,
    filename: 'Test Public KRT on drive - CSV',
    publish: true,
  });
  console.log(assetCsv.id);

  const assetExcel = await assetContentfulDataProvider.createFromUrl({
    id: '',
    fileType: 'application/vnd.ms-excel',
    url: testMappingUrlSpreadsheet!,
    filename: 'Test Public KRT on drive - Spreadsheet',
    publish: true,
  });
  console.log(assetExcel.id);
};

// NOTE: not sure what to do with type 'oth' confirm with PO if we need to add a new type
export const mapManuscriptType = (type: string) => {
  return type === 'org'
    ? 'Original Research'
    : 'Review / Op-Ed / Letter / Hot Topic';
};

// NOTE: there are references to other lifecycle Ids (A and S)
// I assume A is for addendum?
// See https://docs.google.com/spreadsheets/d/1lMIjqE_dlhN2eCuaq2skK3-kQ3C23vI5-aF6xnr0Pw4/edit?gid=0#gid=0
// there's a reference to S but we don't have it in the CMS at the moment
export const mapManuscriptLifecycle = (lifecycle: string) => {
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

// NOTE: there are manuscripts without status and status is a required field in the CMS
export const mapManuscriptStatus = (status: string) => {
  switch (status) {
    case 'Waiting for Report':
      return 'Waiting for Report';
    case 'Review Compliance Report':
      return 'Review Compliance Report';
    case 'Manuscript Re-Submitted':
      return 'Manuscript Resubmitted';
    case '':
      return 'Submit Final Publication';
    case '':
      return 'Addendum Required';
    case '':
      return 'Compliant';
    case 'Closed (Other)':
      return 'Closed (other)';
    default:
      return undefined;
  }
};

export const mapApcPaid = (apcPaid: string) => {
  return apcPaid === 'Paid';
};

export const getDownloadableLinkFromGoogleDriveUrl = (url: string) => {
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
    (input) => {
      const row = input.map((s) => s.trim());

      const manuscriptTitle = row[0] || ''; // title
      const manuscriptId = row[1] || ''; // originalManuscriptId
      // 2 - guiUrl,
      // 3 - urlManuscript,
      // 4 - team1,
      // 5 - team2,
      // 6 - team3,
      // 7 - crnRound,
      const manuscriptNumber = Number(row[8]); // nPaper
      const manuscriptType = mapManuscriptType(row[9] || ''); // type
      const manuscriptLifecycle = mapManuscriptLifecycle(row[10] || ''); // lifecycle
      const manuscriptVersion = Number(row[11]);
      const versionDoiPreprint = row[12];
      const versionDoiPublication = row[13];
      // 14 - dateAddedToComplianceTracker,
      // 15 - dateSubmitedToDataseer,
      // 16 - datePreprint,
      // 17 - datePublication,
      const manuscriptStatus = row[18];
      // 19 - staffResponsible,
      const manuscriptFirstAuthor = row[20];
      // 21 - lab,
      const sharedData = row[22];
      const sharedCode = row[23];
      const sharedProtocols = row[24];
      const sharedMaterials = row[25];
      // 26 - dsMostRecentUrl,
      const krt = getDownloadableLinkFromGoogleDriveUrl(row[27] || ''); //ignore zenodo links
      const dsMostRecent = row[28];
      const apcAmount = Number(row[29] || 0);
      const apcStatus = mapApcPaid(row[30] || '');
      const teamId1 = row[31] || '';
      const teamId2 = row[32];
      const teamId3 = row[33];
      const labId = row[34];
      const staffResponsibleId = row[35];
      // 36 - email,
      const authorId = row[37];
      const pdfLink = getDownloadableLinkFromGoogleDriveUrl(row[38] || ''); // for test replace with own public file

      return {
        manuscriptTitle,
        originalManuscriptId: manuscriptId, // version original manuscript id
        manuscriptNumber, // to order manuscripts - manuscript number will not match but can be used to order
        manuscriptType, // version.type
        manuscriptLifecycle, // version.lifecycle
        manuscriptVersion, // to order manuscripts
        versionDoiPreprint, // version.preprintDoi
        versionDoiPublication, // version.publicationDoi
        manuscriptStatus,
        manuscriptFirstAuthor, // only used for external authors (ignore email provided on authorId column)
        sharedData, // version.datasetsDeposited - Yes; No; Not applicable
        sharedCode, // version.codeDeposited - Yes; No; Not applicable
        sharedProtocols, // version.protocolsDeposited - Yes; No; Not applicable
        sharedMaterials, // version.labMaterialsRegistered - Yes; No; Not applicable
        krt, // version.keyResourceTable
        dsMostRecent, // complianceReport
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
      originalManuscriptId,
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
          // I have an issue here where [(parseResult as any)[teamId1]][manuscriptNumber] is undefined that I was trying to figure out.
          // That's why it's commented out
          // console.log(
          //   'teamId1',
          //   teamId1,
          //   'manuscriptNumber',
          //   manuscriptNumber,
          //   'parseResult',
          //   parseResult,
          // );
          console.log(
            '[(parseResult as any)[teamId1]][manuscriptNumber]',
            [(parseResult as any)[teamId1]][manuscriptNumber],
          );
          // parseResult = {
          //   ...parseResult,
          //   [teamId1]: {
          //     ...[(parseResult as any)[teamId1]],
          //     [manuscriptNumber]: {
          //       ...[(parseResult as any)[teamId1]][manuscriptNumber],
          //       versions: [(parseResult as any)[teamId1]][
          //         manuscriptNumber
          //       ].versions.concat([
          //         {
          //           originalManuscriptId,
          //           manuscriptType,
          //           manuscriptLifecycle,
          //           manuscriptVersion,
          //           versionDoiPreprint,
          //           versionDoiPublication,
          //           manuscriptStatus,
          //           manuscriptFirstAuthor,
          //           sharedData,
          //           sharedCode,
          //           sharedProtocols,
          //           sharedMaterials,
          //           krt,
          //           dsMostRecent,
          //           teamId1,
          //           teamId2,
          //           teamId3,
          //           labId,
          //           authorId,
          //           pdfLink,
          //         },
          //       ]),
          //     },
          //   },
          // };
        } else {
          parseResult = {
            ...parseResult,
            [teamId1]: {
              ...[(parseResult as any)[teamId1]],
              [manuscriptNumber]: {
                manuscriptTitle,
                manuscriptNumber,
                apcAmount,
                apcStatus,
                staffResponsibleId,
                versions: [
                  {
                    originalManuscriptId,
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
                originalManuscriptId,
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

  // const manuscriptVersions = await parseManuscriptsFromCSV(filePath);
  await parseManuscriptsFromCSV(filePath);
  // console.log('manuscriptVersions =>', manuscriptVersions);
  console.log('parseResult =>', parseResult);
};

app().catch(console.error);
