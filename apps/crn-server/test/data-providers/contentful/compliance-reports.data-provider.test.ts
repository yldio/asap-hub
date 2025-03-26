import { Entry, Environment } from '@asap-hub/contentful';

import { when } from 'jest-when';
import { ComplianceReportContentfulDataProvider } from '../../../src/data-providers/contentful/compliance-report.data-provider';

import {
  getComplianceReportCreateDataObject,
  getComplianceReportDataObject,
  getComplianceReportGraphqlResponse,
} from '../../fixtures/compliance-reports.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Compliance Reports Contentful Data Provider', () => {
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const complianceReportDataProvider =
    new ComplianceReportContentfulDataProvider(
      contentfulGraphqlClientMock,
      contentfulRestClientMock,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create', () => {
    test('can create a compliance report', async () => {
      const complianceReportId = 'compliance-report-id-1';
      const complianceReportCreateDataObject =
        getComplianceReportCreateDataObject();

      const publish = jest.fn();

      when(environmentMock.createEntry)
        .calledWith('complianceReports', expect.anything())
        .mockResolvedValue({
          sys: { id: complianceReportId },
          publish,
        } as unknown as Entry);

      const result = await complianceReportDataProvider.create({
        ...complianceReportCreateDataObject,
      });

      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'complianceReports',
        {
          fields: {
            url: {
              'en-US': 'http://example.com',
            },
            description: {
              'en-US': 'Test report',
            },
            manuscriptVersion: {
              'en-US': {
                sys: {
                  id: 'manuscript-version-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
            createdBy: {
              'en-US': {
                sys: {
                  id: 'user-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
          },
        },
      );
      expect(publish).toHaveBeenCalled();
      expect(result).toEqual(complianceReportId);
    });
  });

  describe('Fetch', () => {
    test('should throw an error', async () => {
      await expect(complianceReportDataProvider.fetch()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('Fetch by ID', () => {
    test('should return null when compliance report not found', async () => {
      when(contentfulGraphqlClientMock.request).mockResolvedValue({
        complianceReports: null,
      });

      const result =
        await complianceReportDataProvider.fetchById('non-existent-id');
      expect(result).toBeNull();
    });

    test('should return compliance report when found', async () => {
      when(contentfulGraphqlClientMock.request).mockResolvedValue({
        complianceReports: getComplianceReportGraphqlResponse(),
      });

      const result = await complianceReportDataProvider.fetchById('report-1');

      expect(result).toEqual(getComplianceReportDataObject());
    });

    test('should return team as an empty array when teamsCollection is null', async () => {
      const complianceReport = getComplianceReportGraphqlResponse();
      complianceReport!.createdBy!.teamsCollection = null;

      when(contentfulGraphqlClientMock.request).mockResolvedValue({
        complianceReports: complianceReport,
      });

      const result = await complianceReportDataProvider.fetchById('report-1');

      const expectedResult = getComplianceReportDataObject();
      expectedResult.createdBy.teams = [];
      expect(result).toEqual(expectedResult);
    });

    test('should return count as 1 when count is manuscriptCollection is null', async () => {
      const complianceReport = getComplianceReportGraphqlResponse();
      complianceReport!.manuscriptVersion!.linkedFrom!.manuscriptsCollection =
        null;

      when(contentfulGraphqlClientMock.request).mockResolvedValue({
        complianceReports: complianceReport,
      });

      const result = await complianceReportDataProvider.fetchById('report-1');

      const expectedResult = getComplianceReportDataObject();
      expectedResult.count = 1;
      expect(result).toEqual(expectedResult);
    });
  });
});
