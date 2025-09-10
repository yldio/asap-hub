import fs from 'fs';
import { Asset, Entry, Link } from 'contentful-management';
import { readFile } from 'fs/promises';
import { parseUserDisplayName } from '@asap-hub/server-common';
import { getManuscriptVersionUID } from '../src/data-providers/contentful/manuscript.data-provider';

type ManuscriptVersionExport = {
  title: string;
  url?: string;
  type: string;
  lifecycle: string;
  manuscriptId: string;
  manuscriptFile: string;
  keyResourceTable?: string;
  additionalFiles?: string;
  preprintDoi?: string;
  publicationDoi?: string;
  otherDetails?: string;
  description: string;
  shortDescription: string;
  impact?: string;
  categories?: string;
  teams: string;
  status: string;
  apcRequested?: string;
  apcAmountRequested?: string;
  apcCoverageRequestStatus?: string;
  apcAmountPaid?: string;
  declinedReason?: string;
  acknowledgedGrantNumber?: string;
  acknowledgedGrantNumberDetails?: string;
  asapAffiliationIncluded?: string;
  asapAffiliationIncludedDetails?: string;
  manuscriptLicense?: string;
  manuscriptLicenseDetails?: string;
  datasetsDeposited?: string;
  datasetsDepositedDetails?: string;
  codeDeposited?: string;
  codeDepositedDetails?: string;
  protocolsDeposited?: string;
  protocolsDepositedDetails?: string;
  labMaterialsRegistered?: string;
  labMaterialsRegisteredDetails?: string;
  availabilityStatement?: string;
  availabilityStatementDetails?: string;
  firstAuthors: string;
  correspondingAuthor?: string;
  additionalAuthors?: string;
  assignedUsers?: string;
  labs?: string;
  complianceReportUrl?: string;
  complianceReportDescription?: string;
  versionLastUpdatedDate: string;
};

export const exportComplianceData = async (
  contentfulBackupFileName: string,
  complianceDataFileName?: string,
): Promise<void> => {
  const complianceData = await getComplianceData(contentfulBackupFileName);
  if (complianceData?.manuscriptEntries) {
    const formattedData = formatComplianceData(complianceData);
    const sortedData = formattedData.sort(
      (a, b) =>
        new Date(b.versionLastUpdatedDate).getTime() -
        new Date(a.versionLastUpdatedDate).getTime(),
    );
    const csvRows = generateCSVContent(sortedData);

    fs.writeFileSync(
      complianceDataFileName || `${Date.now()}-compliance-data.csv`,
      csvRows,
    );
  }
};

const getComplianceData = async (filePath: string) => {
  const isPublishedEntry = (entry: Entry) =>
    entry.sys.publishedCounter && entry.sys.publishedCounter > 0;
  try {
    const data = JSON.parse(await readFile(filePath, 'utf8'));
    const assets = data.assets
      .filter(
        (asset: Asset) => asset.fields.file && asset.fields.file['en-US']?.url,
      )
      .map((asset: Asset) => ({
        url: `https:${asset.fields.file['en-US']?.url}`,
        id: asset.sys.id,
      })) as { id: string; url: string }[];

    const groupedEntries = (data.entries as Entry[]).reduce(
      (res, entry) => {
        const contentType = entry.sys.contentType.sys.id;
        switch (contentType) {
          case 'manuscripts':
            isPublishedEntry(entry) && res.manuscriptEntries.push(entry);
            break;
          case 'manuscriptVersions':
            isPublishedEntry(entry) && res.versionEntries.push(entry);
            break;
          case 'complianceReports':
            isPublishedEntry(entry) && res.complianceReportEntries.push(entry);
            break;
          case 'teams':
            res.teamEntries.push(entry);
            break;
          case 'users':
            res.userEntries.push(entry);
            break;
          case 'externalAuthors':
            res.externalAuthorEntries.push(entry);
            break;
          case 'labs':
            res.labEntries.push(entry);
            break;
          case 'impact':
            res.impactEntries.push(entry);
            break;
          case 'category':
            res.categoryEntries.push(entry);
            break;
        }
        return res;
      },
      {
        manuscriptEntries: [] as Entry[],
        versionEntries: [] as Entry[],
        complianceReportEntries: [] as Entry[],
        teamEntries: [] as Entry[],
        userEntries: [] as Entry[],
        externalAuthorEntries: [] as Entry[],
        labEntries: [] as Entry[],
        impactEntries: [] as Entry[],
        categoryEntries: [] as Entry[],
      },
    );

    return { ...groupedEntries, assets };
  } catch (err) {
    console.error(`Error reading JSON file: ${err}`);
    return;
  }
};

type GroupedEntries = {
  manuscriptEntries: Entry[];
  versionEntries: Entry[];
  teamEntries: Entry[];
  userEntries: Entry[];
  externalAuthorEntries: Entry[];
  labEntries: Entry[];
  complianceReportEntries: Entry[];
  impactEntries: Entry[];
  categoryEntries: Entry[];
  assets: { id: string; url: string }[];
};

const formatComplianceData = (entries: GroupedEntries) => {
  const formattedData = [] as ManuscriptVersionExport[];
  const {
    manuscriptEntries,
    versionEntries,
    teamEntries,
    userEntries,
    externalAuthorEntries,
    labEntries,
    complianceReportEntries,
    impactEntries,
    categoryEntries,
    assets,
  } = entries;

  const getLinkedTeamNames = (teamLinks: Link<'Entry'>[]) => {
    return teamLinks
      .map(
        (teamLink) =>
          teamEntries.find((entry) => entry.sys.id === teamLink.sys.id)?.fields
            .displayName['en-US'],
      )
      .join(', ');
  };

  const getLinkedAuthors = (authorLinks: Link<'Entry'>[]) => {
    const authorNames = authorLinks.map((authorLink) => {
      const userLink = userEntries.find(
        (entry) => entry.sys.id === authorLink.sys.id,
      );
      if (userLink) {
        const { firstName, middleName, nickname, lastName } = userLink.fields;
        return parseUserDisplayName(
          firstName?.['en-US'] || '',
          lastName?.['en-US'] || '',
          middleName?.['en-US'] || '',
          nickname?.['en-US'] || '',
        );
      } else {
        return externalAuthorEntries.find(
          (entry) => entry.sys.id === authorLink.sys.id,
        )?.fields.name['en-US'];
      }
    });
    return authorNames.join(', ');
  };

  const getLinkedLabNames = (labLinks: Link<'Entry'>[]) => {
    return labLinks
      .map(
        (labLink) =>
          labEntries.find((entry) => entry.sys.id === labLink.sys.id)?.fields
            .name['en-US'],
      )
      .join(', ');
  };

  const getAssetUrls = (assetLinks: Link<'Asset'>[]) => {
    return assetLinks
      .map(
        (assetLink) =>
          assetLink &&
          assets.find((asset) => asset.id === assetLink.sys.id)?.url,
      )
      .join(', ');
  };

  const getLinkedImpact = (impactLink: Link<'Entry'>) => {
    return impactEntries.find((entry) => entry.sys.id === impactLink.sys.id)
      ?.fields.name['en-US'];
  };

  const getLinkedCategories = (categoryLinks: Link<'Entry'>[]) =>
    categoryLinks
      .map(
        (categoryLink) =>
          categoryEntries.find((entry) => entry.sys.id === categoryLink.sys.id)
            ?.fields.name['en-US'],
      )
      .join(', ');

  for (const manuscriptEntry of manuscriptEntries) {
    const manuscriptFields = manuscriptEntry.fields;
    const versionLinks = manuscriptEntry.fields.versions['en-US'];
    versionLinks.forEach((versionLink: Link<'Entry'>) => {
      const versionEntry = versionEntries.find(
        (entry) => entry.sys.id === versionLink.sys.id,
      );
      const versionFields = versionEntry?.fields;
      const lastUpdatedDate = versionEntry?.sys.publishedAt;
      const linkedComplianceReport = complianceReportEntries.find(
        (complianceReport) =>
          complianceReport.fields.manuscriptVersion['en-US'].sys.id ===
          versionLink.sys.id,
      );
      const submittingTeam = teamEntries.find(
        (teamEntry) =>
          teamEntry.sys.id === manuscriptFields.teams['en-US'][0].sys.id,
      )?.fields;

      formattedData.push({
        title: manuscriptFields.title['en-US'] || '',
        manuscriptId: getManuscriptVersionUID({
          version: {
            type: versionFields?.type['en-US'] || '',
            count: versionFields?.count['en-US'] || '',
            lifecycle: versionFields?.lifecycle['en-US'] || '',
          },
          teamIdCode: submittingTeam?.teamId?.['en-US'] || '',
          grantId: submittingTeam?.grantId?.['en-US'] || '',
          manuscriptCount: manuscriptFields.count?.['en-US'] || '',
        }),
        url: manuscriptFields.url?.['en-US'] || '',
        type: versionFields?.type['en-US'] || '',
        lifecycle: versionFields?.lifecycle['en-US'] || '',
        preprintDoi: versionFields?.preprintDoi?.['en-US'] || '',
        publicationDoi: versionFields?.publicationDoi?.['en-US'] || '',
        otherDetails: versionFields?.otherDetails?.['en-US'] || '',
        manuscriptFile: getAssetUrls([
          versionFields?.manuscriptFile?.['en-US'],
        ]),
        keyResourceTable: versionFields?.keyResourceTable
          ? getAssetUrls([versionFields.keyResourceTable['en-US']])
          : '',
        additionalFiles: versionFields?.additionalFiles
          ? getAssetUrls(versionFields.additionalFiles['en-US'])
          : '',
        description: versionFields?.description?.['en-US'] || '',
        shortDescription: versionFields?.shortDescription?.['en-US'] || '',
        teams: getLinkedTeamNames(versionFields?.teams['en-US']),
        firstAuthors: getLinkedAuthors(versionFields?.firstAuthors['en-US']),
        labs: versionFields?.labs
          ? getLinkedLabNames(versionFields?.labs['en-US'])
          : '',
        correspondingAuthor: versionFields?.correspondingAuthor
          ? getLinkedAuthors(versionFields?.correspondingAuthor['en-US'])
          : '',
        additionalAuthors: versionFields?.additionalAuthors
          ? getLinkedAuthors(versionFields?.additionalAuthors['en-US'])
          : '',
        status: manuscriptFields.status['en-US'] || '',
        acknowledgedGrantNumber:
          versionFields?.acknowledgedGrantNumber?.['en-US'] || '',
        acknowledgedGrantNumberDetails:
          versionFields?.acknowledgedGrantNumberDetails?.['en-US'] || '',
        asapAffiliationIncluded:
          versionFields?.asapAffiliationIncluded?.['en-US'] || '',
        asapAffiliationIncludedDetails:
          versionFields?.asapAffiliationIncludedDetails?.['en-US'] || '',
        availabilityStatement:
          versionFields?.availabilityStatement?.['en-US'] || '',
        availabilityStatementDetails:
          versionFields?.availabilityStatementDetails?.['en-US'] || '',
        codeDeposited: versionFields?.codeDeposited?.['en-US'] || '',
        codeDepositedDetails:
          versionFields?.codeDepositedDetails?.['en-US'] || '',
        datasetsDeposited: versionFields?.datasetsDeposited?.['en-US'] || '',
        datasetsDepositedDetails:
          versionFields?.datasetsDepositedDetails?.['en-US'] || '',
        labMaterialsRegistered:
          versionFields?.labMaterialsRegistered?.['en-US'] || '',
        labMaterialsRegisteredDetails:
          versionFields?.labMaterialsRegisteredDetails?.['en-US'] || '',
        protocolsDeposited: versionFields?.protocolsDeposited?.['en-US'] || '',
        protocolsDepositedDetails:
          versionFields?.protocolsDepositedDetails?.['en-US'] || '',
        manuscriptLicense: versionFields?.manuscriptLicense?.['en-US'] || '',
        manuscriptLicenseDetails:
          versionFields?.manuscriptLicenseDetails?.['en-US'] || '',
        complianceReportDescription:
          linkedComplianceReport?.fields?.description?.['en-US'] || '',
        complianceReportUrl:
          linkedComplianceReport?.fields?.url?.['en-US'] || '',
        apcRequested: manuscriptFields.apcRequested?.['en-US'] || '',
        apcAmountRequested:
          manuscriptFields.apcAmountRequested?.['en-US'] || '',
        apcCoverageRequestStatus:
          manuscriptFields.apcCoverageRequestStatus?.['en-US'] || '',
        apcAmountPaid: manuscriptFields.apcAmountPaid?.['en-US'] || '',
        declinedReason: manuscriptFields.declinedReason?.['en-US'] || '',
        assignedUsers: versionFields?.assignedUsers
          ? getLinkedAuthors(versionFields?.assignedUsers['en-US'])
          : '',
        impact: manuscriptFields.impact
          ? getLinkedImpact(manuscriptFields.impact['en-US'])
          : '',
        categories: manuscriptFields.categories
          ? getLinkedCategories(manuscriptFields.categories?.['en-US'])
          : '',
        versionLastUpdatedDate: lastUpdatedDate || '',
      });
    });
  }
  return formattedData;
};

const generateCSVContent = (versionExports: ManuscriptVersionExport[]) => {
  if (versionExports.length === 0 || !versionExports[0]) return '';

  const headers = Object.keys(versionExports[0]);

  const escapeForCSV = (value: unknown) => {
    if (value === null || value === undefined) return '';
    let str = String(value);

    // Any double quote characters in the value should be escaped with another double quote.
    // See: https://stackoverflow.com/a/21749399
    str = str.replace(/"/g, '""');

    // This is necessary to wrap the value in quotes if it contains a comma, quote, or newline.
    // So the value is not split into multiple columns.
    // For example, if the value is `Hello, World`, it will be wrapped in quotes to `"Hello, World"`
    if (/[",\n]/.test(str)) {
      str = `"${str}"`;
    }

    return str;
  };

  const rows = versionExports.map((row) =>
    headers.map((field) => escapeForCSV((row as any)[field])).join(','),
  );

  return [headers.join(','), ...rows].join('\n');
};
