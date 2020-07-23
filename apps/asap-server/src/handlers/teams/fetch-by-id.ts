import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import Teams from '../../controllers/teams';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    const teams = new Teams();
    const team = await teams.fetchById(params.id);

    return {
      statusCode: 200,
      payload: team,
    };
  },
);
