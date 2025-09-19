import { OpensearchMetricConfig } from '@asap-hub/server-common';
import { Metrics } from './types';

export const PAGE_SIZE = 10;
export const PREPRINT_COMPLIANCE_SHEET_NAME = 'Preprint Compliance';
export const BATCH_SIZE = 50;
export const SHEET_RANGE = 'A:Z';

export const PREPRINT_COMPLIANCE_HEADER_MAPPINGS = {
  '# preprints': 'numberOfPreprints',
  '# publications': 'numberOfPublications',
  '% preprint posted prior to journal submission': 'postedPriorPercentage',
  Ranking: 'ranking',
} as const;

export const validMetrics = [
  'os-champion',
  'preliminary-data-sharing',
  'attendance',
  'preprint-compliance',
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
} as const;
