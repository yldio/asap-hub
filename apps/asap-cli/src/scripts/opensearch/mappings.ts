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

export const teamProductivityPerformanceMapping = {
  properties: {
    article: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
    },
    bioinformatics: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
    },
    dataset: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
    },
    labMaterial: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
    },
    protocol: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
    },
    timeRange: { type: 'keyword' },
    outputType: { type: 'keyword' },
  },
} as const;

export const userCollaborationPerformanceMapping = {
  properties: {
    withinTeam: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
    },
    acrossTeam: {
      properties: {
        belowAverageMin: { type: 'integer' },
        belowAverageMax: { type: 'integer' },
        averageMin: { type: 'integer' },
        averageMax: { type: 'integer' },
        aboveAverageMin: { type: 'integer' },
        aboveAverageMax: { type: 'integer' },
      },
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
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        bioinformatics: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        dataset: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        labMaterial: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        protocol: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
      },
    },
    acrossTeam: {
      properties: {
        article: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        bioinformatics: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        dataset: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        labMaterial: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        protocol: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
      },
    },
    timeRange: { type: 'keyword' },
    outputType: { type: 'keyword' },
  },
} as const;
