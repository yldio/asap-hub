import Boom from '@hapi/boom';
import Chance from 'chance';
import { MongoClient, Db } from 'mongodb';
import { fetchByCode } from '../../src/routes/users';

const chance = new Chance();
describe('GET /api/users/{code}', () => {
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

  test("throws bad request when code isn't present", async () => {
    const result = fetchByCode(
      {
        method: 'post',
        headers: {},
        params: {},
      },
      {
        connection,
      },
    );
    
    expect(result).rejects.toThrow('Error "params": "code" is required');
  });

  test("throws forbidden when code doesn't exist", async () => {
    const result = fetchByCode(
      {
        method: 'post',
        headers: {},
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

    const result = await fetchByCode(
      {
        method: 'post',
        headers: {},
        params: {
          code,
        },
      },
      {
        connection,
      },
    );

    expect(result.payload).toBeDefined();
  });
});
