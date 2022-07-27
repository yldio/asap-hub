import { build } from '@asap-hub/messages-common';
import path from 'path';
import config from './webpack.config';

const templatesDir = path.resolve(__dirname, 'templates');
build(config, templatesDir).catch((err) => {
  console.error(err);
  process.exit(1);
});
