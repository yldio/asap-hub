import {
  researchOutputDocumentTypes,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputPutRequest,
  researchOutputToIdentifierType,
  researchOutputTypes,
} from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import {
  ResearchOutputIdentifierValidationExpression,
  urlExpression,
} from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { JSONSchemaType } from 'ajv';

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
        nullable: true,
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
        pattern: urlExpression,
      },
      title: { type: 'string' },
      asapFunded: { type: 'boolean', nullable: true },
      sharingStatus: { type: 'string' },
      usedInPublication: { type: 'boolean', nullable: true },
      publishDate: { type: 'string', format: 'date-time', nullable: true },
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
    },
    required: [
      'documentType',
      'description',
      'tags',
      'title',
      'sharingStatus',
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

const researchOutputRequestQueryParametersSchema: JSONSchemaType<{
  publish?: boolean;
}> = {
  type: 'object',
  properties: {
    publish: { type: 'boolean', nullable: true },
  },
  additionalProperties: false,
};

export const validateResearchOutputRequestQueryParameters = validateInput(
  researchOutputRequestQueryParametersSchema,
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
