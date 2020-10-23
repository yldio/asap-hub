const path = require('path');
const { promises: fs } = require('fs');
const syncTemplate = require('./sync-template');
const createJsonTemplate = require('./create-json-template');

const main = async () => {
  const templatesDir = path.resolve(__dirname, '..', 'templates');
  const templates = await fs.readdir(templatesDir);

  await Promise.all(
    templates.map(async (t) => {
      const jsonTemplate = createJsonTemplate(path.resolve(templatesDir, t));
      return syncTemplate(jsonTemplate);
    }),
  );
};

main().catch(console.error);
