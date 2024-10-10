import {
  addLocaleToFields,
  Environment,
  getLinkEntity,
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
  constructor(private getRestClient: () => Promise<Environment>) {}

  async fetch(): Promise<ListResponse<ComplianceReportDataObject>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async create(input: ComplianceReportCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const { manuscriptVersionId, ...payload } = input;

    const complianceReport = await environment.createEntry(
      'complianceReports',
      {
        fields: {
          ...addLocaleToFields({
            ...payload,
            manuscriptVersion: getLinkEntity(manuscriptVersionId),
          }),
        },
      },
    );

    await complianceReport.publish();
    return complianceReport.sys.id;
  }
}
