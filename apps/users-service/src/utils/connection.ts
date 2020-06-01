import { MongoClient } from 'mongodb';

export const create = (connectionString: string): Promise<MongoClient> => {
  return MongoClient.connect(connectionString, {
    useUnifiedTopology: true,
  });
};

let singleton: Promise<MongoClient>;
export default (): Promise<MongoClient> => {
  if (singleton) {
    return singleton;
  }

  /* istanbul ignore next */
  const {
    MONGODB_CONNECTION_STRING = 'mongodb://localhost/asap',
  } = process.env;

  singleton = create(MONGODB_CONNECTION_STRING);
  return singleton;
};
