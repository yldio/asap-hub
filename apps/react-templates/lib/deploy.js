const path = require('path');
const webpack = require('webpack');
const { promises: fs } = require('fs');
const webpackConfig = require('./webpack.config');
const syncTemplate = require('./sync-template');

// required by babel-preset-react-app
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const compile = (config) => {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

const syncTemplates = async (templates) => {
  const tasks = templates.map((template) => {
    return syncTemplate(template);
  });
  return Promise.all(tasks);
};

const main = async () => {
  const templatesDir = path.resolve(__dirname, '..', 'templates');
  const templates = await fs.readdir(templatesDir);
  const res = await compile({
    entry: templates.reduce((entries, template) => {
      const { name } = path.parse(template);
      return {
        ...entries,
        [name]: path.resolve(templatesDir, template),
      };
    }, {}),
    ...webpackConfig,
  });

  const outputPath = res.compilation.outputOptions.path;
  const files = await fs.readdir(outputPath);
  const templatesJson = files
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.resolve(outputPath, f));
  await syncTemplates(templatesJson);
};

main().catch(console.error);
