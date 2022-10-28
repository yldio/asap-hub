import { gp2 } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { UrlExpression } from '@asap-hub/validation';
import { JSONSchemaType } from 'ajv';

type WorkingGroupParameters = {
  workingGroupId: string;
};

const workingGroupParametersValidationSchema: JSONSchemaType<WorkingGroupParameters> =
  {
    type: 'object',
    properties: {
      workingGroupId: { type: 'string' },
    },
    required: ['workingGroupId'],
    additionalProperties: false,
  };

export const validateWorkingGroupParameters = validateInput(
  workingGroupParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);

const workingGroupPatchRequestValidationSchema: JSONSchemaType<gp2.WorkingGroupResourcesPutRequest> =
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
              pattern: UrlExpression,
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
export const validateWorkingGroupPatchRequest = validateInput(
  workingGroupPatchRequestValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
