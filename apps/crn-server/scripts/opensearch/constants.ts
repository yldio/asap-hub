import { OpensearchMetricConfig } from '@asap-hub/server-common';
import { Metrics } from './types';

export const PAGE_SIZE = 45;
export const PREPRINT_COMPLIANCE_SHEET_NAME = 'Preprint Compliance';
export const PUBLICATION_COMPLIANCE_ALL_TIME_SHEET_NAME =
  'Publication Compliance_All Time';
export const PUBLICATION_COMPLIANCE_LAST_12_MONTHS_SHEET_NAME =
  'Publication Compliance_Last 12 months';
export const BATCH_SIZE = 50;
export const SHEET_RANGE = 'A:Z';

export const PREPRINT_COMPLIANCE_HEADER_MAPPINGS = {
  '# preprints': 'numberOfPreprints',
  '# publications': 'numberOfPublications',
  '% preprint posted prior to journal submission': 'postedPriorPercentage',
  Ranking: 'ranking',
} as const;

export const PUBLICATION_COMPLIANCE_HEADER_MAPPINGS = {
  'OVERALL COMPLIANCE - Overall Compliance': 'overallCompliance',
  'OVERALL COMPLIANCE - Ranking': 'ranking',
  'RESEARCH OUTPUT COMPLIANCE - Datasets %': 'datasetsPercentage',
  'RESEARCH OUTPUT COMPLIANCE - Datasets Ranking': 'datasetsRanking',
  'RESEARCH OUTPUT COMPLIANCE - Protocols %': 'protocolsPercentage',
  'RESEARCH OUTPUT COMPLIANCE - Protocols Ranking': 'protocolsRanking',
  'RESEARCH OUTPUT COMPLIANCE - Code %': 'codePercentage',
  'RESEARCH OUTPUT COMPLIANCE - Code Ranking': 'codeRanking',
  'RESEARCH OUTPUT COMPLIANCE - Lab Materials %': 'labMaterialsPercentage',
  'RESEARCH OUTPUT COMPLIANCE - Lab Materials Ranking': 'labMaterialsRanking',
  'OVERALL COMPLIANCE - # publications': 'numberOfPublications',
  'OVERALL COMPLIANCE - # outputs': 'numberOfOutputs',
  'RESEARCH OUTPUT COMPLIANCE - # datasets': 'numberOfDatasets',
  'RESEARCH OUTPUT COMPLIANCE - # protocols': 'numberOfProtocols',
  'RESEARCH OUTPUT COMPLIANCE - # code': 'numberOfCode',
  'RESEARCH OUTPUT COMPLIANCE - # lab materials': 'numberOfLabMaterials',
} as const;

export const validMetrics = [
  'os-champion',
  'preliminary-data-sharing',
  'attendance',
  'preprint-compliance',
  'publication-compliance',
  'user-productivity',
] as const;

export const metricConfig: Record<Metrics, OpensearchMetricConfig> = {
  'os-champion': {
    indexAlias: 'os-champion',
    mapping: {
      properties: {
        teamId: { type: 'text' },
        teamName: {
          type: 'text',
          analyzer: 'ngram_analyzer',
          search_analyzer: 'ngram_search_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        isTeamInactive: { type: 'boolean' },
        teamAwardsCount: { type: 'integer' },
        users: {
          type: 'nested',
          properties: {
            id: { type: 'text' },
            name: {
              type: 'text',
              analyzer: 'ngram_analyzer',
              search_analyzer: 'ngram_search_analyzer',
              fields: {
                keyword: { type: 'keyword' },
              },
            },
            awardsCount: { type: 'integer' },
          },
        },
        timeRange: { type: 'keyword' },
      },
    },
  },
  'preliminary-data-sharing': {
    indexAlias: 'preliminary-data-sharing',
    mapping: {
      properties: {
        teamId: { type: 'text' },
        teamName: {
          type: 'text',
          analyzer: 'ngram_analyzer',
          search_analyzer: 'ngram_search_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        isTeamInactive: { type: 'boolean' },
        percentShared: { type: 'integer' },
        limitedData: { type: 'boolean' },
        timeRange: { type: 'keyword' },
      },
    },
  },
  attendance: {
    indexAlias: 'attendance',
    mapping: {
      properties: {
        teamId: { type: 'text' },
        teamName: {
          type: 'text',
          analyzer: 'ngram_analyzer',
          search_analyzer: 'ngram_search_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        isTeamInactive: { type: 'boolean' },
        attendancePercentage: { type: 'integer' },
        limitedData: { type: 'boolean' },
        timeRange: { type: 'keyword' },
      },
    },
  },
  'preprint-compliance': {
    indexAlias: 'preprint-compliance',
    mapping: {
      properties: {
        teamId: { type: 'text' },
        teamName: {
          type: 'text',
          analyzer: 'ngram_analyzer',
          search_analyzer: 'ngram_search_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        isTeamInactive: { type: 'boolean' },
        numberOfPreprints: { type: 'integer' },
        numberOfPublications: { type: 'integer' },
        postedPriorPercentage: { type: 'integer' },
        ranking: { type: 'text' },
        timeRange: { type: 'keyword' },
      },
    },
  },
  'publication-compliance': {
    indexAlias: 'publication-compliance',
    mapping: {
      properties: {
        teamId: { type: 'text' },
        teamName: {
          type: 'text',
          analyzer: 'ngram_analyzer',
          search_analyzer: 'ngram_search_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        isTeamInactive: { type: 'boolean' },
        overallCompliance: { type: 'integer' },
        ranking: { type: 'text' },
        datasetsPercentage: { type: 'integer' },
        datasetsRanking: { type: 'text' },
        protocolsPercentage: { type: 'integer' },
        protocolsRanking: { type: 'text' },
        codePercentage: { type: 'integer' },
        codeRanking: { type: 'text' },
        labMaterialsPercentage: { type: 'integer' },
        labMaterialsRanking: { type: 'text' },
        numberOfPublications: { type: 'integer' },
        numberOfOutputs: { type: 'integer' },
        numberOfDatasets: { type: 'integer' },
        numberOfProtocols: { type: 'integer' },
        numberOfCode: { type: 'integer' },
        numberOfLabMaterials: { type: 'integer' },
        timeRange: { type: 'keyword' },
      },
    },
  },
  'user-productivity': {
    indexAlias: 'user-productivity',
    mapping: {
      properties: {
        id: { type: 'text' },
        name: {
          type: 'text',
          analyzer: 'ngram_analyzer',
          search_analyzer: 'ngram_search_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        isAlumni: { type: 'boolean' },
        teams: {
          type: 'nested',
          properties: {
            id: { type: 'text' },
            name: {
              type: 'text',
              analyzer: 'ngram_analyzer',
              search_analyzer: 'ngram_search_analyzer',
              fields: {
                keyword: { type: 'keyword' },
              },
            },
            role: { type: 'keyword' },
            isTeamInactive: { type: 'boolean' },
            isUserInactiveOnTeam: { type: 'boolean' },
          },
        },
        asapOutput: { type: 'integer' },
        asapPublicOutput: { type: 'integer' },
        ratio: { type: 'float' },
        timeRange: { type: 'keyword' },
        documentCategory: { type: 'keyword' },
      },
    },
  },
} as const;
