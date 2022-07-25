import { JSONSchemaType } from 'ajv';
import { validateInput } from './validation';

type UserInviteParameters = {
  code: string;
};

const userInviteParametersValidationSchema: JSONSchemaType<UserInviteParameters> =
  {
    type: 'object',
    properties: {
      code: { type: 'string' },
    },
    required: ['code'],
    additionalProperties: false,
  };

export const validateUserInviteParameters = validateInput(
  userInviteParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
