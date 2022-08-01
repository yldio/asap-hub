import { configFactory } from '@asap-hub/messages-common';
import path from 'path';
import { Configuration } from 'webpack';
import { GP2_APP_ORIGIN as appOrigin } from './config';

const outputDir = path.resolve(
  require.resolve('@asap-hub/gp2-messages/package.json'),
  '../build-templates',
);
const config: Configuration = configFactory(appOrigin, outputDir);

export default config;
