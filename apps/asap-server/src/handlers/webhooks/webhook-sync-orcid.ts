import { framework as lambda } from '@asap-hub/services-common';
import { SquidexGraphql } from '@asap-hub/squidex';

import { JSONSchemaType } from 'ajv';
import { Handler, NullableOptionalProperties } from '../../utils/types';
import Users from '../../controllers/users';
import validateRequest from '../../utils/validate-squidex-request';
import { validateInput } from '../../validation';

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

const validateBody = validateInput(bodySchema, {
  skipNull: false,
  coerce: true,
});

export const handler: Handler = lambda.http(async (request) => {
  await validateRequest(request);

  const { payload, type: event } = validateBody(request.payload as never);

  const squidexGraphqlClient = new SquidexGraphql();
  const users = new Users(squidexGraphqlClient);
  const { id } = payload;
  const newOrcid = payload.data.orcid?.iv;

  if (event === 'UsersCreated') {
    if (newOrcid) {
      return {
        statusCode: 200,
        payload: await users.syncOrcidProfile(id),
      };
    }
  }

  if (event === 'UsersUpdated') {
    if (newOrcid && newOrcid !== payload.dataOld?.orcid?.iv) {
      return {
        statusCode: 200,
        payload: await users.syncOrcidProfile(id),
      };
    }
  }

  return { statusCode: 204 };
});
