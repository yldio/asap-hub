import Chance from 'chance';
import { MongoClient, Db, ObjectId } from 'mongodb';
import { create } from '../../src/routes/users';

const { MONGODB_URL = 'mongodb://localhost:27017/asap' } = process.env;

const chance = new Chance();
describe('POST /api/users', () => {
  let db: Db;
  let connection: MongoClient;

  beforeAll(async () => {
    connection = await MongoClient.connect(MONGODB_URL, {
      useUnifiedTopology: true,
    });
    db = connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('throws when adding an existent email', async () => {
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
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

  test('creates a new user', async () => {
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
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
    expect(result.payload.invite).not.toBeDefined();

    const [record] = await db
      .collection('users')
      .find({ _id: new ObjectId(result.payload.id) })
      .limit(1)
      .toArray();

    expect(record.invite).toBeDefined();
    expect(record.displayName).toStrictEqual(payload.displayName);
  });
});
