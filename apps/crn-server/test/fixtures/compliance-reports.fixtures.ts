import { FetchComplianceReportByIdQuery } from '@asap-hub/contentful';
import {
  ComplianceReportCreateDataObject,
  ComplianceReportDataObject,
} from '@asap-hub/model';

export const getComplianceReportGraphqlResponse =
  (): FetchComplianceReportByIdQuery['complianceReports'] => ({
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
  });

export const getComplianceReportDataObject =
  (): ComplianceReportDataObject => ({
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

export const getComplianceReportCreateDataObject =
  (): ComplianceReportCreateDataObject => {
    const {
      count: _,
      createdDate: __,
      id: ___,
      createdBy,
      ...complianceReport
    } = getComplianceReportDataObject();

    return {
      ...complianceReport,
      manuscriptVersionId: 'manuscript-version-1',
      userId: createdBy.id,
    };
  };
