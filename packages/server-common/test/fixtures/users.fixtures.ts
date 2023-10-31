import { OrcidWork, UserDataObject } from '@asap-hub/model';
import { ORCIDWorksResponse } from '../../src/utils/fetch-orcid';

export const getUserDataObject = (): UserDataObject => ({
  id: 'userId',
  firstName: 'Tony',
  lastName: 'Stark',
  email: 'tony@.stark.com',
  connections: [],
  createdDate: '2020-09-25T09:42:51.000Z',
  expertiseAndResourceTags: [],
  labs: [],
  lastModifiedDate: '2020-09-25T09:42:51.132Z',
  questions: [],
  role: 'Grantee',
  teams: [
    {
      displayName: 'Unknown',
      id: 'team-id-1',
      role: 'Lead PI (Core Leadership)',
      inactiveSinceDate: '',
    },
    {
      displayName: 'Unknown',
      id: 'team-id-3',
      role: 'Collaborating PI',
      inactiveSinceDate: '2022-09-25T09:42:51.000Z',
    },
  ],
  workingGroups: [],
  interestGroups: [],
});

export const getOrcidWorksResponse = (): ORCIDWorksResponse => ({
  'last-modified-date': { value: 1594690575911 },
  group: [
    {
      'last-modified-date': { value: 1593270649404 },
      'external-ids': {
        'external-id': [
          {
            'external-id-type': 'doi',
            'external-id-value': '10.1101/2020.06.24.169219',
            'external-id-url': null,
            'external-id-relationship': 'SELF',
          },
          {
            'external-id-type': 'doi',
            'external-id-value': '10.1101/2020.06.24.169219',
            'external-id-url': {
              value: 'https://doi.org/10.1101/2020.06.24.169219',
            },
            'external-id-relationship': 'SELF',
          },
        ],
      },
      'work-summary': [
        {
          'put-code': 76241838,
          'created-date': { value: 1593086686737 },
          'last-modified-date': { value: 1593270649404 },
          source: {
            'source-orcid': null,
            'source-client-id': {
              uri: 'https://orcid.org/client/0000-0001-9884-1913',
              path: '0000-0001-9884-1913',
              host: 'orcid.org',
            },
            'source-name': { value: 'Crossref' },
          },
          title: {
            title: {
              value:
                'JIP3 links lysosome transport to regulation of multiple components of the axonal cytoskeleton',
            },
            subtitle: null,
            'translated-title': null,
          },
          'external-ids': {
            'external-id': [
              {
                'external-id-type': 'doi',
                'external-id-value': '10.1101/2020.06.24.169219',
                'external-id-url': {
                  value: 'https://doi.org/10.1101/2020.06.24.169219',
                },
                'external-id-relationship': 'SELF',
              },
            ],
          },
          type: 'OTHER',
          'publication-date': {
            year: { value: '2020' },
            month: { value: '06' },
            day: { value: '24' },
            'media-type': null,
          },
          visibility: 'PUBLIC',
          path: '/0000-0001-9045-0723/work/76241838',
          'display-index': '0',
        },
      ],
    },
  ],
  path: '/0000-0001-9045-0723/works',
});

export const orcidWorksDeserialisedExpectation: OrcidWork[] = [
  {
    doi: 'https://doi.org/10.1101/2020.06.24.169219',
    id: '76241838',
    title:
      'JIP3 links lysosome transport to regulation of multiple components of the axonal cytoskeleton',
    type: 'OTHER',
    publicationDate: { year: '2020', month: '06', day: '24' },
    lastModifiedDate: '1593270649404',
  },
];
