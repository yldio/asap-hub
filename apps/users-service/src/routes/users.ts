import Joi from '@hapi/joi';
import Users, { User } from '../controllers/users';
import { Db } from '../data';
import {
  validate,
  Request,
  Response,
  RequestContext,
} from '../framework/lambda';

export const create = async (
  request: Request,
  context: RequestContext,
): Promise<Response> => {
  const payload = validate(
    'payload',
    request.payload,
    Joi.object({
      displayName: Joi.string().required(),
      email: Joi.string().email().required(),
    }).required(),
  ) as User;

  const users = new Users(new Db(context.connection));
  const user = await users.create(payload);

  return {
    statusCode: 201,
    payload: user,
  };
};

export const connectByCode = async (
  request: Request,
  context: RequestContext,
): Promise<Response> => {
  const params = validate(
    'params',
    request.params,
    Joi.object({
      code: Joi.string().required(),
    }).required(),
  ) as {
    code: string;
  };

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
  ) as {
    authorization: string;
  };

  const [, token] = headers.authorization.split(' ');
  const users = new Users(new Db(context.connection));
  await users.connectByCode(params.code, token);

  return {
    statusCode: 202,
  };
};

export const fetchByCode = async (
  request: Request,
  context: RequestContext,
): Promise<Response> => {
  const params = validate(
    'params',
    request.params,
    Joi.object({
      code: Joi.string().required(),
    }).required(),
  ) as {
    code: string;
  };

  const users = new Users(new Db(context.connection));
  const user = await users.fetchByCode(params.code);
  return {
    payload: user,
  };
};
