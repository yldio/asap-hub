import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type GroupParameters = {
  groupId: string;
};

const groupParametersValidationSchema: JSONSchemaType<GroupParameters> = {
  type: 'object',
  properties: {
    groupId: { type: 'string' },
  },
  required: ['groupId'],
  additionalProperties: false,
};

export const validateGroupParameters = validateInput(
  groupParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
