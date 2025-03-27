import {
  addLocaleToFields,
  Environment,
  FETCH_COMPLIANCE_REPORT_BY_ID,
  FetchComplianceReportByIdQuery,
  FetchComplianceReportByIdQueryVariables,
  getLinkEntity,
  GraphQLClient,
} from '@asap-hub/contentful';
import {
  ComplianceReportCreateDataObject,
  ComplianceReportDataObject,
  ListResponse,
} from '@asap-hub/model';
import { parseUserDisplayName } from '@asap-hub/server-common';

import { ComplianceReportDataProvider } from '../types';

export class ComplianceReportContentfulDataProvider
  implements ComplianceReportDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(): Promise<ListResponse<ComplianceReportDataObject>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(id: string): Promise<ComplianceReportDataObject | null> {
    const { complianceReports } = await this.contentfulClient.request<
      FetchComplianceReportByIdQuery,
      FetchComplianceReportByIdQueryVariables
    >(FETCH_COMPLIANCE_REPORT_BY_ID, { id });

    if (!complianceReports) {
      return null;
    }

    return parseComplianceReport(complianceReports);
  }
  async create(input: ComplianceReportCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const { manuscriptVersionId, userId, ...payload } = input;

    const complianceReport = await environment.createEntry(
      'complianceReports',
      {
        fields: {
          ...addLocaleToFields({
            ...payload,
            manuscriptVersion: getLinkEntity(manuscriptVersionId),
            createdBy: getLinkEntity(userId),
          }),
        },
      },
    );

    await complianceReport.publish();
    return complianceReport.sys.id;
  }
}

const parseUser = (
  user: NonNullable<
    NonNullable<FetchComplianceReportByIdQuery['complianceReports']>
  >['createdBy'],
): ComplianceReportDataObject['createdBy'] => ({
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

const parseComplianceReport = (
  complianceReport: NonNullable<
    NonNullable<FetchComplianceReportByIdQuery['complianceReports']>
  >,
): ComplianceReportDataObject => ({
  id: complianceReport.sys.id,
  url: complianceReport.url || '',
  description: complianceReport.description || '',
  count:
    complianceReport.manuscriptVersion?.linkedFrom?.manuscriptsCollection
      ?.items[0]?.versionsCollection?.total || 1,
  createdDate: complianceReport.sys.firstPublishedAt,
  createdBy: parseUser(complianceReport.createdBy),
});
