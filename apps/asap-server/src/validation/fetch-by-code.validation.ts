import { JSONSchemaType } from 'ajv';
import { validateInput } from './index';

type Params = {
  code: string;
};
const paramsSchema: JSONSchemaType<Params> = {
  type: 'object',
  properties: {
    code: { type: 'string' },
  },
  required: ['code'],
  additionalProperties: false,
};
export const validateParams = validateInput(paramsSchema, {
  skipNull: false,
  coerce: true,
});
