import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import parseURI from 'parse-data-url';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';

import validateUser from '../../utils/validate-user';
import Users from '../../controllers/users';
import { Handler } from '../../utils/types';

export const handler: Handler = http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const user = await validateUser(request);

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    if (user.id !== params.id) {
      throw Boom.forbidden();
    }

    const payloadSchema = Joi.object({
      avatar: Joi.string().required(),
    }).required();

    const payload = lambda.validate(
      'payload',
      request.payload,
      payloadSchema,
    ) as {
      avatar: string;
    };

    const parsed = parseURI(payload.avatar);

    // Shouldnt break here. Joi is doing validation prior to this
    if (!parsed) {
      throw Boom.badRequest('avatar must be a valid data URL');
    }

    if (!parsed.contentType.startsWith('image')) {
      throw Boom.unsupportedMediaType('Content-type must be image');
    }

    const users = new Users(request.headers);
    const avatar = parsed.toBuffer();

    // convert bytes to MB and check size
    // 3MB = 2.8MB (2MB Base64 image) + some margin
    if (avatar.length / 1e6 > 3) {
      throw Boom.entityTooLarge('Avatar must be smaller than 2MB');
    }

    const updatedUser = await users.updateAvatar(
      params.id,
      avatar,
      parsed.contentType,
    );

    return {
      statusCode: 200,
      payload: updatedUser,
    };
  },
);
