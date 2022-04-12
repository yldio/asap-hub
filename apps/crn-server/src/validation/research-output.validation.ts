import {
  ResearchOutputPostRequest,
  researchOutputSubtypes,
  ResearchOutputIdentifierType,
  researchOutputToIdentifierType,
  researchOutputDocumentTypes,
} from '@asap-hub/model';
import { JSONSchemaType } from 'ajv';
import Boom from '@hapi/boom';
import { validateInput } from '.';

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
      subTypes: {
        type: 'array',
        items: { type: 'string', enum: researchOutputSubtypes },
        nullable: true,
      },
      description: { type: 'string' },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
      link: { type: 'string', nullable: true },
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
      accessInstructions: { type: 'string', nullable: true },
      doi: {
        type: 'string',
        nullable: true,
        pattern: '^(doi:)?\\d{2}\\.\\d{4}.*$',
      },
      accession: {
        type: 'string',
        nullable: true,
        pattern: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
      },
      labCatalogNumber: { type: 'string', nullable: true },
      rrid: { type: 'string', nullable: true, pattern: 'RRID:[a-zA-Z]+.+$' },
    },
    required: [
      'documentType',
      'description',
      'tags',
      'title',
      'sharingStatus',
      'addedDate',
      'teams',
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
  const identifierRequired = data.asapFunded && data.usedInPublication;

  if (
    identifierRequired &&
    !data.rrid &&
    !data.doi &&
    !data.accession &&
    !data.labCatalogNumber
  ) {
    throw Boom.badRequest('Validation error', {
      details: `An identifier is required for research output that is funded and used in a publication`,
    });
  }

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
    data.labCatalogNumber &&
    !types.includes(ResearchOutputIdentifierType.LabCatalogNumber)
  ) {
    throw Boom.badRequest('Validation error', {
      details: `Lab catalog number identifier is not supported for research output of type ${data.documentType}`,
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
