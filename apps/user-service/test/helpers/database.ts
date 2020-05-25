import Mongo, { ObjectId } from 'mongodb';
import { connectByCode } from '../../src/routes/users';

export class Db {
  connection: Promise<Mongo.MongoClient>;

  constructor(uri: string) {
    this.connection = Mongo.MongoClient.connect(uri, {
      useUnifiedTopology: true,
    });
  }

  async clean(collection: string) {
    const connection = await this.connection;
    await connection.db().collection(collection).deleteMany({});
  }

  async insert(collection: string, docs: any[]) {
    const connection = await this.connection;
    const res = await connection.db().collection(collection).insertMany(docs);
    return res.ops;
  }

  async close() {
    const connection = await this.connection;
    connection.close();
  }
}
