import { JSONSchemaType } from 'ajv';
import { validateInput } from '@asap-hub/server-common';

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
