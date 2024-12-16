import {
  addLocaleToFields,
  Environment,
  FetchComplianceReportsByManuscriptVersionIdQuery,
  FetchComplianceReportsByManuscriptVersionIdQueryVariables,
  FETCH_COMPLIANCE_REPORTS_BY_MANUSCRIPT_VERSION_ID,
  getLinkEntity,
  GraphQLClient,
} from '@asap-hub/contentful';
import {
  ComplianceReportCreateDataObject,
  ComplianceReportDataObject,
  ListResponse,
} from '@asap-hub/model';

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

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async fetchComplianceReportCountByManuscriptVersionId(id: string) {
    const { manuscriptVersions } = await this.contentfulClient.request<
      FetchComplianceReportsByManuscriptVersionIdQuery,
      FetchComplianceReportsByManuscriptVersionIdQueryVariables
    >(FETCH_COMPLIANCE_REPORTS_BY_MANUSCRIPT_VERSION_ID, { id });

    return (
      manuscriptVersions?.linkedFrom?.complianceReportsCollection?.total || 0
    );
  }

  async create(input: ComplianceReportCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const { manuscriptVersionId, userId, ...payload } = input;

    const currentComplianceReportCount =
      await this.fetchComplianceReportCountByManuscriptVersionId(
        manuscriptVersionId,
      );

    const complianceReport = await environment.createEntry(
      'complianceReports',
      {
        fields: {
          ...addLocaleToFields({
            ...payload,
            count: currentComplianceReportCount + 1,
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
