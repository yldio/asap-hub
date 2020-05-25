import Chance from 'chance';
import { MongoClient, Db } from 'mongodb';
import { create } from '../../src/routes/users';

const chance = new Chance();
describe('POST /api/users', () => {
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

  test('throws when adding an existent email', async () => {
    const payload = {
      displayName: `${chance.string()} ${chance.string()}`,
      email: chance.email(),
    };

    const result1 = await create(
      {
        method: 'post',
        headers: {},
        payload,
      },
      {
        connection,
      },
    );
    expect(result1.statusCode).toStrictEqual(201);

    const result2 = create(
      {
        method: 'post',
        headers: {},
        payload,
      },
      {
        connection,
      },
    );
    expect(result2).rejects.toThrow('Forbidden');
  });

  test('throws forbidden when code doesn\t exist', async () => {
    const payload = {
      displayName: `${chance.string()} ${chance.string()}`,
      email: chance.email(),
    };

    const result = await create(
      {
        method: 'post',
        headers: {},
        payload,
      },
      {
        connection,
      },
    );
    expect(result.statusCode).toStrictEqual(201);
    expect(result.payload.id).toBeDefined();
    expect(result.payload.displayName).toStrictEqual(payload.displayName);
    expect(result.payload.email).toStrictEqual(payload.email);
  });
});
