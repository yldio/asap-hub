import { gp2 } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
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
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: [] },
        description: { type: 'string' },
        externalLink: { type: 'string' },
      },
      required: ['title', 'type'],
      additionalProperties: false,
    },
    required: true,
  };
export const validateWorkingGroupPatchRequest = validateInput(
  workingGroupPatchRequestValidationSchema,
  {
    skipNull: true,
  },
);
