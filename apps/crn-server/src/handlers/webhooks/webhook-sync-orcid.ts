import { framework as lambda } from '@asap-hub/services-common';
import { SquidexGraphql } from '@asap-hub/squidex';
import { Handler } from '../../utils/types';
import Users from '../../controllers/users';
import validateRequest from '../../utils/validate-squidex-request';
import { validateBody } from '../../validation/webhook-sync-orcid.validation';

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
