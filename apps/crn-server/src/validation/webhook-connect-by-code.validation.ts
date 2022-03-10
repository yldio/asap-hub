import { JSONSchemaType } from 'ajv';
import { validateInput } from './index';

type Body = {
  code: string;
  userId: string;
};
const bodySchema: JSONSchemaType<Body> = {
  type: 'object',
  properties: {
    code: { type: 'string' },
    userId: { type: 'string' },
  },
  required: ['code', 'userId'],
  additionalProperties: false,
};
export const validateBody = validateInput(bodySchema, {
  skipNull: false,
  coerce: true,
});
