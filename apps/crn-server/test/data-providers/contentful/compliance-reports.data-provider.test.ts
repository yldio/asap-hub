import { Entry, Environment } from '@asap-hub/contentful';

import { when } from 'jest-when';
import { ComplianceReportContentfulDataProvider } from '../../../src/data-providers/contentful/compliance-report.data-provider';

import { getComplianceReportCreateDataObject } from '../../fixtures/compliance-reports.fixtures';
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
    test('should return null when compliance report not found', async () => {
      when(contentfulGraphqlClientMock.request).mockResolvedValue({
        complianceReports: null,
      });

      const result =
        await complianceReportDataProvider.fetchById('non-existent-id');
      expect(result).toBeNull();
    });

    test('should return compliance report when found', async () => {
      const mockResponse = {
        complianceReports: {
          sys: { id: 'report-1', firstPublishedAt: '2024-01-01' },
          url: 'http://example.com',
          description: 'Test report',
          manuscriptVersion: {
            linkedFrom: {
              manuscriptsCollection: {
                items: [{ versionsCollection: { total: 3 } }],
              },
            },
          },
          createdBy: {
            sys: { id: 'user-1' },
            firstName: 'John',
            lastName: 'Doe',
            nickname: 'JD',
            avatar: { url: 'avatar.jpg' },
            alumniSinceDate: '2024-01-01',
            teamsCollection: {
              items: [
                {
                  team: {
                    sys: { id: 'team-1' },
                    displayName: 'Team A',
                  },
                },
              ],
            },
          },
        },
      };

      when(contentfulGraphqlClientMock.request).mockResolvedValue(mockResponse);

      const result = await complianceReportDataProvider.fetchById('report-1');

      expect(result).toEqual({
        id: 'report-1',
        url: 'http://example.com',
        description: 'Test report',
        count: 3,
        createdDate: '2024-01-01',
        createdBy: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John (JD) Doe',
          avatarUrl: 'avatar.jpg',
          alumniSinceDate: '2024-01-01',
          teams: [
            {
              id: 'team-1',
              name: 'Team A',
            },
          ],
        },
      });
    });
  });
});
