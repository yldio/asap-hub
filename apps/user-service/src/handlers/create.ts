import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import connection from './connection';
import { Db } from '../db';
import { http, HTTPEvent } from '../utils/events';
import Users, { User } from '../controllers/users';

export const handler: APIGatewayProxyHandler = async (event) =>
  http(event, {
    handler: async (event: HTTPEvent) => {
      const client = await connection();
      const users = new Users(new Db(client));

      await users.create(event.payload as User);
      return {
        output: {
          statusCode: 201,
        },
      };
    },
    options: {
      validate: {
        payload: Joi.object({
          displayName: Joi.string().required(),
          email: Joi.string().email().required(),
        }).required(),
      },
    },
  });
