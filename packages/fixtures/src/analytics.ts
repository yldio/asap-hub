import {
  UserProductivityPerformance,
  PerformanceMetricByDocumentType,
  TeamCollaborationPerformance,
  TeamProductivityAlgoliaResponse,
  UserProductivityAlgoliaResponse,
} from '@asap-hub/model';

export const teamProductivityResponse: TeamProductivityAlgoliaResponse = {
  id: '1',
  objectID: '1-team-productivity-30d',
  name: 'Test Team',
  isInactive: false,
  Article: 1,
  Bioinformatics: 2,
  Dataset: 3,
  'Lab Resource': 4,
  Protocol: 5,
};

export const userProductivityResponse: UserProductivityAlgoliaResponse = {
  id: '1',
  objectID: '1-user-productivity-30d',
  name: 'Test User',
  isAlumni: false,
  teams: [
    {
      id: '1',
      team: 'Team A',
      isTeamInactive: false,
      isUserInactiveOnTeam: false,
      role: 'Collaborating PI',
    },
  ],
  asapOutput: 1,
  asapPublicOutput: 2,
  ratio: '0.50',
};

export const userProductivityPerformance: UserProductivityPerformance = {
  asapOutput: {
    belowAverageMin: 0,
    belowAverageMax: 1,
    averageMin: 2,
    averageMax: 4,
    aboveAverageMin: 5,
    aboveAverageMax: 7,
  },
  asapPublicOutput: {
    belowAverageMin: 0,
    belowAverageMax: 0,
    averageMin: 1,
    averageMax: 2,
    aboveAverageMin: 3,
    aboveAverageMax: 4,
  },
  ratio: {
    belowAverageMin: 0,
    belowAverageMax: 0.14,
    averageMin: 0.15,
    averageMax: 0.8,
    aboveAverageMin: 0.81,
    aboveAverageMax: 1,
  },
};
export const performanceByDocumentType: PerformanceMetricByDocumentType = {
  article: {
    belowAverageMin: 0,
    belowAverageMax: 2,
    averageMin: 3,
    averageMax: 19,
    aboveAverageMin: 20,
    aboveAverageMax: 20,
  },
  bioinformatics: {
    belowAverageMin: 0,
    belowAverageMax: 4,
    averageMin: 5,
    averageMax: 9,
    aboveAverageMin: 10,
    aboveAverageMax: 13,
  },
  dataset: {
    belowAverageMin: 0,
    belowAverageMax: 3,
    averageMin: 4,
    averageMax: 9,
    aboveAverageMin: 10,
    aboveAverageMax: 12,
  },
  labResource: {
    belowAverageMin: 0,
    belowAverageMax: 2,
    averageMin: 3,
    averageMax: 5,
    aboveAverageMin: 6,
    aboveAverageMax: 8,
  },
  protocol: {
    belowAverageMin: 0,
    belowAverageMax: 0,
    averageMin: 1,
    averageMax: 2,
    aboveAverageMin: 3,
    aboveAverageMax: 3,
  },
};

export const teamCollaborationPerformance: TeamCollaborationPerformance = {
  withinTeam: performanceByDocumentType,
  acrossTeam: performanceByDocumentType,
};
