// In this file you can configure migrate-mongo
const url = require('url');

const {
  MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017/asap',
} = process.env;

const connectionString = new url.URL(MONGODB_CONNECTION_STRING);
const databaseName = connectionString.pathname.substring(1);
const config = {
  mongodb: {
    url: connectionString.toString(),
    databaseName,

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

module.exports = config;
