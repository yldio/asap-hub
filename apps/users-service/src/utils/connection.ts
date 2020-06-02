import { MongoClient } from 'mongodb';
import { mongoDbConnectionString } from '../config';

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

  singleton = create(mongoDbConnectionString);
  return singleton;
};
