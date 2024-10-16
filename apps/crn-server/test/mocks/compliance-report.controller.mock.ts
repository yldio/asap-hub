import ComplianceReportController from '../../src/controllers/compliance-report.controller';

export const complianceReportControllerMock = {
  create: jest.fn(),
} as unknown as jest.Mocked<ComplianceReportController>;
