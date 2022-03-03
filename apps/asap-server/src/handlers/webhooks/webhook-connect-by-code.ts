import { SquidexGraphql } from '@asap-hub/squidex';
import { framework as lambda } from '@asap-hub/services-common';

import { JSONSchemaType } from 'ajv';
import Users from '../../controllers/users';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-auth0-request';
import { validateInput } from '../../validation';

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

const validateBody = validateInput(bodySchema, {
  skipNull: false,
  coerce: true,
});

export const handler: Handler = lambda.http(async (request) => {
  await validateRequest(request);

  const { code, userId } = validateBody(request.payload as never);

  const squidexGraphqlClient = new SquidexGraphql();
  const users = new Users(squidexGraphqlClient);
  await users.connectByCode(code, userId);

  return {
    statusCode: 202,
  };
});
