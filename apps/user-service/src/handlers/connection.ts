import { MongoClient } from 'mongodb';

let singleton: Promise<MongoClient>;
export default (): Promise<MongoClient> => {
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
};
