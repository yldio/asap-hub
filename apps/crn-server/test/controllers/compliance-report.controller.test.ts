import { GenericError } from '@asap-hub/errors';
import ComplianceReportController from '../../src/controllers/compliance-report.controller';
import { ComplianceReportDataProvider } from '../../src/data-providers/types';
import { getComplianceReportCreateDataObject } from '../fixtures/compliance-reports.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Compliance Report controller', () => {
  const complianceReportDataProviderMock: jest.Mocked<ComplianceReportDataProvider> =
    getDataProviderMock();

  const complianceReportController = new ComplianceReportController(
    complianceReportDataProviderMock,
  );

  describe('Create method', () => {
    beforeEach(jest.clearAllMocks);

    test('Should throw when fails to create the compliance report', async () => {
      complianceReportDataProviderMock.create.mockRejectedValueOnce(
        new GenericError(),
      );

      await expect(
        complianceReportController.create(
          getComplianceReportCreateDataObject(),
        ),
      ).rejects.toThrow(GenericError);
    });

    test('Should create the new compliance report and return its id', async () => {
      const complianceReportId = 'compliance-report-id-1';
      complianceReportDataProviderMock.create.mockResolvedValueOnce(
        complianceReportId,
      );

      const result = await complianceReportController.create(
        getComplianceReportCreateDataObject(),
      );

      expect(result).toEqual(complianceReportId);
      expect(complianceReportDataProviderMock.create).toHaveBeenCalledWith(
        getComplianceReportCreateDataObject(),
      );
    });
  });
});
