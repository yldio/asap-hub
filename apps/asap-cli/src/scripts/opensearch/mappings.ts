// OpenSearch index mappings for productivity performance metrics

// Shared performance range structure used across all metrics
const performanceRangeProperties = {
  belowAverageMin: { type: 'integer' },
  belowAverageMax: { type: 'integer' },
  averageMin: { type: 'integer' },
  averageMax: { type: 'integer' },
  aboveAverageMin: { type: 'integer' },
  aboveAverageMax: { type: 'integer' },
} as const;

const performanceRangePropertiesFloat = {
  belowAverageMin: { type: 'float' },
  belowAverageMax: { type: 'float' },
  averageMin: { type: 'float' },
  averageMax: { type: 'float' },
  aboveAverageMin: { type: 'float' },
  aboveAverageMax: { type: 'float' },
} as const;

export const userProductivityPerformanceMapping = {
  properties: {
    asapOutput: {
      properties: performanceRangeProperties,
    },
    asapPublicOutput: {
      properties: performanceRangeProperties,
    },
    ratio: {
      properties: performanceRangePropertiesFloat,
    },
    timeRange: { type: 'keyword' },
    documentCategory: { type: 'keyword' },
  },
} as const;

export const teamProductivityPerformanceMapping = {
  properties: {
    article: {
      properties: performanceRangeProperties,
    },
    bioinformatics: {
      properties: performanceRangeProperties,
    },
    dataset: {
      properties: performanceRangeProperties,
    },
    labMaterial: {
      properties: performanceRangeProperties,
    },
    protocol: {
      properties: performanceRangeProperties,
    },
    timeRange: { type: 'keyword' },
    outputType: { type: 'keyword' },
  },
} as const;

export const userCollaborationPerformanceMapping = {
  properties: {
    withinTeam: {
      properties: performanceRangeProperties,
    },
    acrossTeam: {
      properties: performanceRangeProperties,
    },
    timeRange: { type: 'keyword' },
    documentCategory: { type: 'keyword' },
  },
} as const;

export const teamCollaborationPerformanceMapping = {
  properties: {
    withinTeam: {
      properties: {
        article: {
          properties: performanceRangeProperties,
        },
        bioinformatics: {
          properties: performanceRangeProperties,
        },
        dataset: {
          properties: performanceRangeProperties,
        },
        labMaterial: {
          properties: performanceRangeProperties,
        },
        protocol: {
          properties: performanceRangeProperties,
        },
      },
    },
    acrossTeam: {
      properties: {
        article: {
          properties: performanceRangeProperties,
        },
        bioinformatics: {
          properties: performanceRangeProperties,
        },
        dataset: {
          properties: performanceRangeProperties,
        },
        labMaterial: {
          properties: performanceRangeProperties,
        },
        protocol: {
          properties: performanceRangeProperties,
        },
      },
    },
    timeRange: { type: 'keyword' },
    outputType: { type: 'keyword' },
  },
} as const;
