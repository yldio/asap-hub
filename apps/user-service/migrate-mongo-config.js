// In this file you can configure migrate-mongo

const { MONGODB_URL = 'mongodb://localhost:27017/asap' } = process.env;

const config = {
  mongodb: {
    url: MONGODB_URL,

    databaseName: MONGODB_DATABASE,

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
