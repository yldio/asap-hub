import { ComplianceReportCreateDataObject } from '@asap-hub/model';

import { ComplianceReportDataProvider } from '../data-providers/types';

export default class ComplianceReportController {
  constructor(
    private complianceReportDataProvider: ComplianceReportDataProvider,
  ) {}

  async create(
    complianceReportCreateData: ComplianceReportCreateDataObject,
  ): Promise<string | null> {
    return this.complianceReportDataProvider.create(complianceReportCreateData);
  }
}
