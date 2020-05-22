import Mongo, { ObjectId } from 'mongodb';

export class Client {
  connection: Promise<Mongo.MongoClient>;

  constructor(uri: string) {
    this.connection = Mongo.MongoClient.connect(uri, {
      useUnifiedTopology: true,
    });
  }

  async clean(collection: string) {
    const client = await this.connection;
    await client.db().collection(collection).deleteMany({});
  }

  async insert(collection: string, docs: any[]) {
    const client = await this.connection;
    const res = await client.db().collection(collection).insertMany(docs);
    return res.ops;
  }

  async close() {
    await this.connection;
  }
}
