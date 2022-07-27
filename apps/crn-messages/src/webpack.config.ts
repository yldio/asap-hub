import { configFactory } from '@asap-hub/messages-common';
import path from 'path';
import { Configuration } from 'webpack';
import { APP_ORIGIN as appOrigin } from './config';

const outputDir = path.resolve(
  require.resolve('@asap-hub/crn-messages/package.json'),
  '../build-templates',
);
const config: Configuration = configFactory(appOrigin, outputDir);

export default config;
