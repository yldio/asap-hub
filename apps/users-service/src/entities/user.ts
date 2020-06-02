import Joi from '@hapi/joi';
import { Entity } from '../data/base';

export interface Connection {
  id: string;
  raw: unknown;
  source: string;
}

export interface User extends Entity {
  connections: [Connection];
  displayName: string;
  email: string;
}

export const createSchema = Joi.object({
  displayName: Joi.string().required(),
  email: Joi.string().required(),
});
