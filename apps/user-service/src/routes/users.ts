import Joi from '@hapi/joi';
import Users from '../controllers/users';
import { Db } from '../db';
import { validate, Request, Response } from '../framework/lambda';

export const create = async (
  request: Request,
  context: any,
): Promise<Response> => {
  const payload = validate(
    'payload',
    request.payload,
    Joi.object({
      displayName: Joi.string().required(),
      email: Joi.string().email().required(),
    }).required(),
  );

  const users = new Users(new Db(context.connection));
  const user = await users.create(payload);

  return {
    statusCode: 201,
    payload: user,
  };
};

export const connectByCode = async (
  request: Request,
  context: any,
): Promise<Response> => {
  const params = validate(
    'params',
    request.params,
    Joi.object({
      code: Joi.string().required(),
    }).required(),
  );

  const headers = validate(
    'headers',
    request.headers,
    Joi.object({
      authorization: Joi.string()
        .pattern(/^Bearer /i)
        .required(),
    })
      .required()
      .options({
        allowUnknown: true,
      }),
  );

  const [, accessToken] = headers.authorization.split(' ');
  const users = new Users(new Db(context.connection));
  await users.connectByCode(params.code, accessToken);

  return {
    statusCode: 201,
  };
};

export const fetchByCode = async (
  request: Request,
  context: any,
): Promise<Response> => {
  const params = validate(
    'params',
    request.params,
    Joi.object({
      code: Joi.string().required(),
    }).required(),
  );

  const users = new Users(new Db(context.connection));
  const user = await users.fetchByCode(params.code);
  return {
    payload: user,
  };
};
