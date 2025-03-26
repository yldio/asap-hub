import { GenericError } from '@asap-hub/errors';
import ComplianceReportController from '../../src/controllers/compliance-report.controller';
import { ComplianceReportDataProvider } from '../../src/data-providers/types';
import { getComplianceReportCreateDataObject } from '../fixtures/compliance-reports.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Compliance Report controller', () => {
  const mockComplianceReport = {
    id: 'test-id',
    url: 'test-url',
    description: 'test description',
    count: 1,
    createdDate: '2024-01-01',
    createdBy: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      avatarUrl: 'avatar.jpg',
      teams: [{ id: 'team-1', name: 'Team 1' }],
    },
  };

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

    test('Should create the new compliance report and return the created compliance report', async () => {
      const complianceReportId = 'compliance-report-id-1';
      complianceReportDataProviderMock.create.mockResolvedValueOnce(
        complianceReportId,
      );
      complianceReportDataProviderMock.fetchById.mockResolvedValueOnce(
        mockComplianceReport,
      );
      const result = await complianceReportController.create(
        getComplianceReportCreateDataObject(),
      );

      expect(result).toEqual(mockComplianceReport);
      expect(complianceReportDataProviderMock.create).toHaveBeenCalledWith(
        getComplianceReportCreateDataObject(),
      );
    });
  });

  describe('fetchById method', () => {
    beforeEach(jest.clearAllMocks);

    test('Should throw NotFoundError when compliance report does not exist', async () => {
      complianceReportDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(
        complianceReportController.fetchById('non-existent-id'),
      ).rejects.toThrow('Compliance Report with id null not found');
    });

    test('Should return compliance report when it exists', async () => {
      complianceReportDataProviderMock.fetchById.mockResolvedValueOnce(
        mockComplianceReport,
      );

      const result = await complianceReportController.fetchById('test-id');

      expect(result).toEqual(mockComplianceReport);
      expect(complianceReportDataProviderMock.fetchById).toHaveBeenCalledWith(
        'test-id',
      );
    });
  });
});
