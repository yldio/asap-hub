import {
  ResearchOutputPostRequest,
  researchOutputSubtypes,
  researchOutputTypes,
} from '@asap-hub/model';
import { JSONSchemaType } from 'ajv';
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
      type: {
        type: 'string',
        enum: researchOutputTypes,
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
            name: { type: 'string', nullable: true },
            id: { type: 'string', nullable: true },
          },
        },
        nullable: true,
      },
      teams: { type: 'array', items: { type: 'string' }, minItems: 1 },
      accessInstructions: { type: 'string', nullable: true },
    },
    required: [
      'type',
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
    coerce: false,
  },
);
