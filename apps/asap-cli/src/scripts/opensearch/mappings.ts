// OpenSearch index mappings for productivity performance metrics

export const userProductivityPerformanceMapping = {
  properties: {
    asapOutput: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
    },
    asapPublicOutput: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
    },
    ratio: {
      properties: {
        belowAverageMin: { type: 'float' },
        belowAverageMax: { type: 'float' },
        averageMin: { type: 'float' },
        averageMax: { type: 'float' },
        aboveAverageMin: { type: 'float' },
        aboveAverageMax: { type: 'float' },
      },
    },
    timeRange: { type: 'keyword' },
    documentCategory: { type: 'keyword' },
  },
} as const;
