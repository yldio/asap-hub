import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type UserParameters = {
  userId: string;
};

const userParametersValidationSchema: JSONSchemaType<UserParameters> = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
  },
  required: ['userId'],
  additionalProperties: false,
};

export const validateUserParameters = validateInput(
  userParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
