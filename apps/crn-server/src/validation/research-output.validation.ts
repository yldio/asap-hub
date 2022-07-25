import {
  ResearchOutputPostRequest,
  researchOutputTypes,
  ResearchOutputIdentifierType,
  researchOutputToIdentifierType,
  researchOutputDocumentTypes,
  ResearchOutputPutRequest,
} from '@asap-hub/model';
import {
  ResearchOutputIdentifierValidationExpression,
  UrlExpression,
} from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { JSONSchemaType } from 'ajv';
import { validateInput } from '@asap-hub/server-common';

type ResearchOutputParameters = {
  researchOutputId: string;
};

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
      },
      description: { type: 'string' },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
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
      link: {
        type: 'string',
        nullable: true,
        pattern: UrlExpression,
      },
      title: { type: 'string' },
      asapFunded: { type: 'boolean', nullable: true },
      sharingStatus: { type: 'string' },
      usedInPublication: { type: 'boolean', nullable: true },
      addedDate: { type: 'string' },
      publishDate: { type: 'string', format: 'date-time', nullable: true },
      labs: {
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
    },
    required: [
      'documentType',
      'type',
      'description',
      'tags',
      'title',
      'sharingStatus',
      'addedDate',
      'teams',
      'methods',
      'organisms',
      'environments',
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
>(researchOutputPostRequestValidationSchema, {
  skipNull: true,
  coerce: true,
});
