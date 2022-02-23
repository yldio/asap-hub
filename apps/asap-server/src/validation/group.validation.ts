import { JSONSchemaType } from 'ajv';
import { validateInput } from './';

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
