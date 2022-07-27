import { promises as fs } from 'fs';
import path from 'path';
import webpack, { Configuration, Stats } from 'webpack';

// required by babel-preset-react-app
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const compile = (config: Configuration): Promise<Stats | undefined> => {
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

export const build = async (
  webpackConfig: Configuration,
  templatesDir: string,
) => {
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
  if (!res) {
    throw new Error('Missing webpack compilation stats');
  }
  const outputPath = res.compilation.outputOptions.path;
  if (!outputPath) {
    throw new Error('Cannot determine output dir');
  }
  if (res.hasErrors()) {
    throw new Error(res.compilation.errors.join('\n'));
  }
};
