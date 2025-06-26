import {
  FetchOptions,
  researchOutputDocumentTypes,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputPutRequest,
  researchOutputToIdentifierType,
  researchOutputTypes,
} from '@asap-hub/model';
import {
  fetchOptionsValidationSchema,
  validateInput,
} from '@asap-hub/server-common';
import {
  ResearchOutputIdentifierValidationExpression,
  urlExpression,
} from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { JSONSchemaType } from 'ajv';

type ResearchOutputParameters = {
  researchOutputId: string;
};

type ResearchOutputFetchOptions = FetchOptions & {
  status?: string;
  teamId?: string;
  workingGroupId?: string;
};

const researchOutputFetchOptionsValidationSchema: JSONSchemaType<ResearchOutputFetchOptions> =
  {
    type: 'object',
    properties: {
      ...fetchOptionsValidationSchema.properties,
      status: { type: 'string', enum: ['draft'], nullable: true },
      teamId: { type: 'string', nullable: true },
      workingGroupId: { type: 'string', nullable: true },
    },
    additionalProperties: false,
  };

export const validateResearchOutputFetchOptions = validateInput(
  researchOutputFetchOptionsValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

const researchOutputParametersValidationSchema: JSONSchemaType<ResearchOutputParameters> =
  {
    type: 'object',
    properties: {
      researchOutputId: { type: 'string' },
    },
    required: ['researchOutputId'],
    additionalProperties: false,
  };

export const validateResearchOutputParameters = validateInput(
  researchOutputParametersValidationSchema,
  {
    skipNull: false,
    coerce: false,
  },
);

const researchOutputPostRequestValidationSchema: JSONSchemaType<ResearchOutputPostRequest> =
  {
    type: 'object',
    properties: {
      documentType: {
        type: 'string',
        enum: researchOutputDocumentTypes,
      },
      type: {
        type: 'string',
        enum: researchOutputTypes,
        nullable: true,
      },
      description: { type: 'string', nullable: true },
      descriptionMD: { type: 'string' },
      shortDescription: { type: 'string', nullable: true, maxLength: 250 },
      changelog: { type: 'string', nullable: true, maxLength: 250 },
      methods: {
        type: 'array',
        items: { type: 'string' },
      },
      organisms: {
        type: 'array',
        items: { type: 'string' },
      },
      environments: {
        type: 'array',
        items: { type: 'string' },
      },
      subtype: {
        type: 'string',
        nullable: true,
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
      },
      link: {
        type: 'string',
        nullable: true,
        pattern: urlExpression,
      },
      title: { type: 'string' },
      asapFunded: { type: 'boolean', nullable: true },
      sharingStatus: { type: 'string' },
      usedInPublication: { type: 'boolean', nullable: true },
      publishDate: { type: 'string', format: 'date-time', nullable: true },
      impact: { type: 'string', nullable: true },
      categories: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      labs: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      relatedResearch: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      relatedEvents: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      authors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            externalAuthorId: { type: 'string' },
            externalAuthorName: { type: 'string' },
          },
          oneOf: [
            {
              type: 'object',
              required: ['userId'],
            },
            {
              type: 'object',
              required: ['externalAuthorId'],
            },
            {
              type: 'object',
              required: ['externalAuthorName'],
            },
          ],
        },
        nullable: true,
      },
      teams: { type: 'array', items: { type: 'string' }, minItems: 1 },
      workingGroups: { type: 'array', items: { type: 'string' }, minItems: 0 },
      usageNotes: { type: 'string', nullable: true },
      doi: {
        type: 'string',
        nullable: true,
        pattern: ResearchOutputIdentifierValidationExpression.DOI,
      },
      accession: {
        type: 'string',
        nullable: true,
        pattern:
          ResearchOutputIdentifierValidationExpression['Accession Number'],
      },
      labCatalogNumber: { type: 'string', nullable: true },
      rrid: {
        type: 'string',
        nullable: true,
        pattern: ResearchOutputIdentifierValidationExpression.RRID,
      },
      published: {
        type: 'boolean',
      },
      isInReview: {
        type: 'boolean',
        nullable: true,
        default: false,
      },
    },
    required: [
      'documentType',
      'descriptionMD',
      'title',
      'sharingStatus',
      'teams',
      'methods',
      'organisms',
      'environments',
      'keywords',
      'published',
    ],
    additionalProperties: false,
  };

const researchOutputPutRequestValidationSchema: JSONSchemaType<ResearchOutputPutRequest> =
  {
    type: 'object',
    properties: {
      documentType: {
        type: 'string',
        enum: researchOutputDocumentTypes,
      },
      type: {
        type: 'string',
        enum: researchOutputTypes,
        nullable: true,
      },
      description: { type: 'string', nullable: true },
      descriptionMD: { type: 'string' },
      shortDescription: { type: 'string', nullable: true, maxLength: 250 },
      changelog: { type: 'string', nullable: true, maxLength: 250 },
      methods: {
        type: 'array',
        items: { type: 'string' },
      },
      organisms: {
        type: 'array',
        items: { type: 'string' },
      },
      environments: {
        type: 'array',
        items: { type: 'string' },
      },
      subtype: {
        type: 'string',
        nullable: true,
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
      },
      link: {
        type: 'string',
        nullable: true,
        pattern: urlExpression,
      },
      title: { type: 'string' },
      asapFunded: { type: 'boolean', nullable: true },
      sharingStatus: { type: 'string' },
      usedInPublication: { type: 'boolean', nullable: true },
      publishDate: { type: 'string', format: 'date-time', nullable: true },
      impact: { type: 'string', nullable: true },
      categories: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      labs: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      relatedResearch: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      relatedEvents: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      authors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            externalAuthorId: { type: 'string' },
            externalAuthorName: { type: 'string' },
          },
          oneOf: [
            {
              type: 'object',
              required: ['userId'],
            },
            {
              type: 'object',
              required: ['externalAuthorId'],
            },
            {
              type: 'object',
              required: ['externalAuthorName'],
            },
          ],
        },
        nullable: true,
      },
      teams: { type: 'array', items: { type: 'string' }, minItems: 1 },
      statusChangedById: { type: 'string', nullable: true },
      workingGroups: { type: 'array', items: { type: 'string' }, minItems: 0 },
      usageNotes: { type: 'string', nullable: true },
      doi: {
        type: 'string',
        nullable: true,
        pattern: ResearchOutputIdentifierValidationExpression.DOI,
      },
      accession: {
        type: 'string',
        nullable: true,
        pattern:
          ResearchOutputIdentifierValidationExpression['Accession Number'],
      },
      labCatalogNumber: { type: 'string', nullable: true },
      rrid: {
        type: 'string',
        nullable: true,
        pattern: ResearchOutputIdentifierValidationExpression.RRID,
      },
      published: {
        type: 'boolean',
      },
      isInReview: {
        type: 'boolean',
      },
      hasStatusChanged: {
        type: 'boolean',
        nullable: true,
      },
      createVersion: {
        type: 'boolean',
        nullable: true,
      },
    },
    required: [
      'documentType',
      'descriptionMD',
      'title',
      'sharingStatus',
      'teams',
      'methods',
      'organisms',
      'environments',
      'keywords',
    ],
    additionalProperties: false,
  };

export const validateResearchOutputPostRequestParameters = validateInput(
  researchOutputPostRequestValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

export const validateResearchOutputPostRequestParametersIdentifiers = (
  data: ResearchOutputPostRequest,
): void => {
  const types = researchOutputToIdentifierType[data.documentType];

  if (data.rrid && !types.includes(ResearchOutputIdentifierType.RRID)) {
    throw Boom.badRequest('Validation error', {
      details: `RRID identifier is not supported for research output of type ${data.documentType}`,
    });
  }
  if (data.doi && !types.includes(ResearchOutputIdentifierType.DOI)) {
    throw Boom.badRequest('Validation error', {
      details: `DOI identifier is not supported for research output of type ${data.documentType}`,
    });
  }
  if (
    data.accession &&
    !types.includes(ResearchOutputIdentifierType.AccessionNumber)
  ) {
    throw Boom.badRequest('Validation error', {
      details: `Accession number identifier is not supported for research output of type ${data.documentType}`,
    });
  }
};

export const validateResearchOutputPutRequestParameters = validateInput<
  ResearchOutputPutRequest,
  true
>(researchOutputPutRequestValidationSchema, {
  skipNull: true,
  coerce: true,
});
