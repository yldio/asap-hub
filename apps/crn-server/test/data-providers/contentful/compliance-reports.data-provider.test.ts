import { Entry, Environment } from '@asap-hub/contentful';

import { when } from 'jest-when';
import { ComplianceReportContentfulDataProvider } from '../../../src/data-providers/contentful/compliance-report.data-provider';

import { getComplianceReportCreateDataObject } from '../../fixtures/compliance-reports.fixtures';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Compliance Reports Contentful Data Provider', () => {
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const complianceReportDataProvider =
    new ComplianceReportContentfulDataProvider(contentfulRestClientMock);

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
          },
        },
      );
      expect(publish).toHaveBeenCalled();
      expect(result).toEqual(complianceReportId);
    });
  });
});
