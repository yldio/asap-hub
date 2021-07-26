import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../../utils/instrumented-framework';
import { UserController } from '../../../controllers/users';
import validateRequest from '../../../utils/validate-auth0-request';
import { Handler } from '../../../utils/types';

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
): Handler =>
  http(async (request: lambda.Request): Promise<lambda.Response> => {
    await validateRequest(request);

    const paramsSchema = Joi.object({
      code: Joi.string().required(),
    }).required();

    const { code } = lambda.validate(
      'params',
      request.params,
      paramsSchema,
    ) as {
      code: string;
    };

    const user = await userController.fetchByCode(code);

    return {
      payload: user,
    };
  });
