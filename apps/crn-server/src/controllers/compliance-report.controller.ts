import { NotFoundError } from '@asap-hub/errors';
import {
  ComplianceReportCreateDataObject,
  ComplianceReportResponse,
} from '@asap-hub/model';

import { ComplianceReportDataProvider } from '../data-providers/types';

export default class ComplianceReportController {
  constructor(
    private complianceReportDataProvider: ComplianceReportDataProvider,
  ) {}

  async fetchById(
    complianceReportId: string,
  ): Promise<
    Omit<ComplianceReportResponse['complianceReport'], 'manuscriptId'>
  > {
    const complianceReport =
      await this.complianceReportDataProvider.fetchById(complianceReportId);

    if (!complianceReport) {
      throw new NotFoundError(
        undefined,
        `Compliance Report with id ${complianceReportId} not found`,
      );
    }

    return complianceReport;
  }

  async create(
    complianceReportCreateData: ComplianceReportCreateDataObject,
  ): Promise<
    Omit<ComplianceReportResponse['complianceReport'], 'manuscriptId'>
  > {
    const complianceReportId = await this.complianceReportDataProvider.create(
      complianceReportCreateData,
    );
    return this.fetchById(complianceReportId);
  }
}
