import { FetchOptions, gp2 } from '@asap-hub/model';
import {
  validateInput,
  fetchOptionsValidationSchema,
} from '@asap-hub/server-common';
import { urlExpression } from '@asap-hub/validation';
import { JSONSchemaType } from 'ajv';

type ProjectParameters = {
  projectId: string;
};

const projectFetchValidationSchema: JSONSchemaType<FetchOptions> = {
  type: 'object',
  properties: {
    ...fetchOptionsValidationSchema.properties,
  },
  additionalProperties: false,
  required: [],
};

const projectParametersValidationSchema: JSONSchemaType<ProjectParameters> = {
  type: 'object',
  properties: {
    projectId: { type: 'string' },
  },
  required: ['projectId'],
  additionalProperties: false,
};

export const validateFetchProjectsParameters = validateInput(
  projectFetchValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
export const validateProjectParameters = validateInput(
  projectParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
const projectPutRequestValidationSchema: JSONSchemaType<gp2.ProjectResourcesPutRequest> =
  {
    type: 'array',
    items: {
      anyOf: [
        {
          type: 'object',
          properties: {
            title: { type: 'string' },
            type: { type: 'string', const: 'Link' },
            description: { type: 'string', nullable: true },
            externalLink: {
              type: 'string',
              pattern: urlExpression,
            },
          },
          required: ['title', 'type', 'externalLink'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            title: { type: 'string' },
            type: { type: 'string', const: 'Note' },
            description: { type: 'string', nullable: true },
          },
          required: ['title', 'type'],
          additionalProperties: false,
        },
      ],
    },
  };
export const validateProjectPutRequest = validateInput(
  projectPutRequestValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
