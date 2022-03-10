import { JSONSchemaType } from 'ajv';
import { validateInput } from './index';
import { NullableOptionalProperties } from '../utils/types';

type RestUser = NullableOptionalProperties<{
  orcid?: {
    iv: string;
  };
}>;
const userSchema: JSONSchemaType<RestUser> = {
  type: 'object',
  properties: {
    orcid: {
      type: 'object',
      nullable: true,
      properties: { iv: { type: 'string' } },
      required: ['iv'],
    },
  },
};
type WebhookPayloadUser = NullableOptionalProperties<{
  type: string;
  payload: NullableOptionalProperties<{
    id: string;
    data: RestUser;
    dataOld?: RestUser;
  }>;
}>;
const bodySchema: JSONSchemaType<WebhookPayloadUser> = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    payload: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        data: userSchema,
        dataOld: { ...userSchema, nullable: true },
      },
      required: ['data', 'id'],
    },
  },
  required: ['type', 'payload'],
};
export const validateBody = validateInput(bodySchema, {
  skipNull: false,
  coerce: true,
});
