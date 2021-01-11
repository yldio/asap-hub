import { RestTeam } from '@asap-hub/squidex';
import { TeamResponse, TeamTool } from '@asap-hub/model';
import { config } from '@asap-hub/squidex';
import { RestUser } from '@asap-hub/squidex';
import { ResponseFetchTeam } from '../../../src/controllers/teams';

export const getUpdateTeamResponse = (tools: TeamTool[] = []): RestTeam => ({
  id: 'team-id-1',
  data: {
    displayName: { iv: 'Cristiano Ronaldo' },
    applicationNumber: { iv: 'hofded' },
    projectTitle: {
      iv:
        'Ce fe kok ob lovkad pim cukiviw lakwujuz vilid camiduci nim ca perkeb mekkaho wuculate re huppoljop.',
    },
    projectSummary: {
      iv:
        'Wi dalev fu jusjuh buw nauzi kas ma. Fo ajelo pu vaenusug ezuhsi resdudif ebsofak tav dan mumooz awgabu meki gicub bowec afegeir tozab umefarow.',
    },
    skills: { iv: [] },
    outputs: { iv: [] },
    tools: { iv: tools },
  },
  created: '2020-09-08T16:35:28Z',
  lastModified: '2020-09-08T16:35:28Z',
});

export const getGraphQlTeamResponse = (
  tools: TeamTool[] = [],
): { data: ResponseFetchTeam } => ({
  data: {
    findTeamsContent: {
      id: 'team-id-1',
      created: '2020-09-23T20:33:36Z',
      lastModified: '2020-11-26T11:56:04Z',
      flatData: {
        applicationNumber: 'ASAP-000420',
        displayName: 'Schipa, A',
        outputs: [
          {
            id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
            created: '2020-09-17T08:18:01Z',
            lastModified: '2020-10-21T13:11:50Z',
            flatData: {
              link: null,
              publishDate: null,
              shortText: null,
              title: 'Proposal',
              type: 'Proposal',
            },
          },
          {
            id: '7198d072-de87-4b80-90ca-4a1abe67952e',
            created: '2020-11-24T16:33:30Z',
            lastModified: '2020-11-26T13:45:49Z',
            flatData: {
              link: 'docs.google.com',
              publishDate: null,
              shortText: null,
              title: "Team Salzer's intro slide deck",
              type: 'Presentation',
            },
          },
        ],
        projectSummary: null,
        projectTitle:
          'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
        skills: ['Animal resources'],
        proposal: [
          {
            id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
          },
        ],
        tools,
      },
    },
  },
});

export const usersResponseTeam1: { total: number; items: RestUser[] } = {
  total: 1,
  items: [
    {
      id: 'user-id-1',
      data: {
        role: { iv: 'Grantee', },
        lastModifiedDate: { iv: '2020-09-25T09:42:51.132Z', },
        email: { iv: 'cristiano@ronaldo.com', },
        firstName: { iv: 'Cristiano', },
        lastName: { iv: 'Ronaldo', },
        jobTitle: { iv: 'Junior', },
        orcid: { iv: '363-98-9330', },
        institution: { iv: 'Dollar General Corporation', },
        location: { iv: 'Zofilte', },
        avatar: { iv: ['uuid-user-id-1'], },
        skills: { iv: [], },
        orcidWorks: { iv: [], },
        teams: {
          iv: [
            {
              role: 'Lead PI (Core Leadership)',
              id: ['team-id-1'],
            },
          ],
        },
        connections: { iv: [], },
        questions: { iv: [], },
      },
      created: '2020-09-25T09:42:51Z',
      lastModified: '2020-09-25T09:42:51Z',
    },
  ],
};

export const expectation: TeamResponse = {
  id: 'team-id-1',
  displayName: 'Schipa, A',
  lastModifiedDate: '2020-11-26T11:56:04.000Z',
  skills: ['Animal resources'],
  outputs: [
    {
      id: '7198d072-de87-4b80-90ca-4a1abe67952e',
      created: '2020-11-24T16:33:30.000Z',
      link: 'docs.google.com',
      type: 'Presentation',
      title: "Team Salzer's intro slide deck",
      text: '',
      team: {
        id: 'team-id-1',
        displayName: 'Schipa, A',
      },
    },
    {
      id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
      created: '2020-09-17T08:18:01.000Z',
      type: 'Proposal',
      title: 'Proposal',
      text: '',
      team: {
        id: 'team-id-1',
        displayName: 'Schipa, A',
      },
    },
  ],
  members: [
    {
      id: 'user-id-1',
      firstName: 'Cristiano',
      lastName: 'Ronaldo',
      avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-1`,
      email: 'cristiano@ronaldo.com',
      displayName: 'Cristiano Ronaldo',
      role: 'Lead PI (Core Leadership)',
    },
  ],
  applicationNumber: 'ASAP-000420',
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  proposalURL: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
  tools: [],
};
