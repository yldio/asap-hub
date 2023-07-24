import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type GroupParameters = {
  groupId: string;
};

const interestGroupParametersValidationSchema: JSONSchemaType<GroupParameters> =
  {
    type: 'object',
    properties: {
      groupId: { type: 'string' },
    },
    required: ['groupId'],
    additionalProperties: false,
  };

export const validateInterestGroupParameters = validateInput(
  interestGroupParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
