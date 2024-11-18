import { JSONSchemaType } from 'ajv';
import { validateInput } from '.';

export type CookieData = {
  cookieId: string;
  preferences: {
    analytics: boolean;
    essential: boolean;
  };
};
const cookieCreateDataSchema: JSONSchemaType<CookieData> = {
  type: 'object',
  properties: {
    cookieId: { type: 'string' },
    preferences: {
      type: 'object',
      properties: {
        analytics: { type: 'boolean' },
        essential: { type: 'boolean' },
      },
      required: ['analytics', 'essential'],
    },
  },
  required: ['cookieId', 'preferences'],
  additionalProperties: false,
};
export const validateCookieCreateData = validateInput(cookieCreateDataSchema);
