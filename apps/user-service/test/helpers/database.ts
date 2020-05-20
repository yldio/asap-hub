import Mongo from 'mongodb';

export class Client {
  connection: Promise<Mongo.MongoClient>;

  constructor(uri: string) {
    this.connection = Mongo.MongoClient.connect(uri, {
      useUnifiedTopology: true,
    });
  }

  async dropCollection(collection: string) {
    const client = await this.connection;
    const collections = await client.db().listCollections().toArray();
    if (collections.indexOf(collection) !== -1) {
      await client.db().collection(collection).drop();
    }
  }

  async insert(collection: string, docs: any[]) {
    const client = await this.connection;
    await client.db().collection(collection).insertMany(docs);
  }

  async close() {
    const client = await this.connection;
    client.close();
  }
}
