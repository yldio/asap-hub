import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';

import { Handler } from '../../utils/types';
import Users from '../../controllers/users';
import { CMSUser } from '../../entities/user';

export interface WebHookPayload {
  type: string;
  payload: CMSUser & { dataOld?: CMSUser['data'] };
}

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const bodySchema = Joi.object({
      type: Joi.string().required(),
      payload: Joi.object({
        id: Joi.string().required(),
        data: Joi.object().required(),
        dataOld: Joi.object(),
      })
        .unknown()
        .required(),
    })
      .unknown()
      .required();

    const { payload, type: event } = lambda.validate(
      'body',
      request.payload,
      bodySchema,
    ) as WebHookPayload;

    const users = new Users();
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
  },
);
