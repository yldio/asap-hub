import Joi from '@hapi/joi';
import { framework } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';
import { Handler } from '../../utils/types';
import validateUser from '../../utils/validate-user';
import Groups from '../../controllers/groups';

const paramsSchema = Joi.object({
  id: Joi.string().required(),
}).required();

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
}).required();

export const handler: Handler = http(async (request) => {
  await validateUser(request);

  const params = framework.validate('params', request.params, paramsSchema) as {
    id: string;
  };

  const options = (framework.validate(
    'query',
    request.query,
    querySchema,
  ) as unknown) as {
    take: number;
    skip: number;
  };

  const groups = new Groups(request.headers);
  const res = await groups.fetchByTeamId(params.id, options);

  return {
    payload: res,
  };
});
