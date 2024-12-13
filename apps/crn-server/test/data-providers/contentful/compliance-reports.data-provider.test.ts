import {
  Entry,
  Environment,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';

import { when } from 'jest-when';
import { ComplianceReportContentfulDataProvider } from '../../../src/data-providers/contentful/compliance-report.data-provider';

import { getComplianceReportCreateDataObject } from '../../fixtures/compliance-reports.fixtures';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Compliance Reports Contentful Data Provider', () => {
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      ComplianceReportsCollection: () => ({ total: 0 }),
    });

  const complianceReportDataProvider =
    new ComplianceReportContentfulDataProvider(
      contentfulGraphqlClientMockServer,
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
            count: {
              'en-US': 1,
            },
            description: {
              'en-US': 'compliance report description',
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
                  id: 'user-id',
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
    test('should throw an error', async () => {
      await expect(complianceReportDataProvider.fetchById()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
