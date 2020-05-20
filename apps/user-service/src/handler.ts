import Boom from '@hapi/boom';
import Bourne from '@hapi/bourne';
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import Users from './controllers/users-controller';
import { Db } from './database';
import { normalize, wrapper } from './helpers/http';

let singleton: Promise<MongoClient>;
async function connect(): Promise<MongoClient> {
  if (singleton) {
    return singleton;
  }
  const {
    MONGODB_CONNECTION_STRING = 'mongodb://localhost/local',
  } = process.env;

  singleton = MongoClient.connect(MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true,
  });
  return singleton;
}

async function createUsersController() {
  const client = await connect();
  return new Users(new Db(client));
}

async function fetchUserByCode(event: any) {
  const {
    pathParameters: { code },
  } = event;

  const users = await createUsersController();
  return users.fetchByCode(code);
}

async function linkUserByCode(event: APIGatewayProxyEvent) {
  const {
    pathParameters: { code },
    headers: { authorization = '' },
  } = normalize(event);

  const [method, accessToken] = authorization.split(' ');
  if ((method || '').toLocaleLowerCase() !== 'bearer') {
    throw Boom.forbidden();
  }

  const users = await createUsersController();
  await users.linkByCode(code, accessToken);
  return {
    output: {
      statusCode: 204,
    },
  };
}

export const welcome: APIGatewayProxyHandler = wrapper(
  async (event: APIGatewayProxyEvent) => {
    const { httpMethod } = event;
    const method = httpMethod.toLocaleLowerCase();
    if (method === 'get') {
      return fetchUserByCode(event);
    }

    //
    // istanbul ignore else
    if (method === 'post') {
      return linkUserByCode(event);
    }

    // API Gateway ensures the right HTTP methods are invoked.
    // In theory the following lines are dead code.
    // istanbul ignore next
    throw Boom.methodNotAllowed();
  },
);

export const createUser: APIGatewayProxyHandler = wrapper(
  async (event: APIGatewayProxyEvent) => {
    const users = await createUsersController();
    await users.create(Bourne.parse(event.body));
    return {
      output: {
        statusCode: 201,
      },
    };
  },
);
