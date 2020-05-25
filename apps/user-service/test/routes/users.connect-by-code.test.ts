import Boom from '@hapi/boom';
import Chance from 'chance';
import { connectByCode } from '../../src/routes/users';
import { MongoClient, Db } from 'mongodb';

const chance = new Chance();
describe('POST /api/users/{code}', () => {
  let db: Db;
  let connection: MongoClient;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost/local', {
      useUnifiedTopology: true,
    });
    db = connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('throws forbidden when code doesn\t exist', async () => {
    const result = connectByCode(
      {
        method: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        params: {
          code: chance.string(),
        },
      },
      {
        connection,
      },
    );
    expect(result).rejects.toMatchObject(Boom.forbidden());
  });

  test('return 200 when code exists', async () => {
    const code = chance.string();
    await db.collection('users').insertMany([
      {
        displayName: `${chance.first()} ${chance.last()}`,
        email: chance.email(),
        invite: {
          code,
        },
      },
    ]);

    const result = await connectByCode(
      {
        method: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        params: {
          code,
        },
      },
      {
        connection,
      },
    );

    expect(result.statusCode).toStrictEqual(201);
  });
});
