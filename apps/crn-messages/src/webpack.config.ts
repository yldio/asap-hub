import { configFactory } from '@asap-hub/messages-common';
import path from 'path';
import { Configuration } from 'webpack';
import { APP_ORIGIN as appOrigin } from './config';

const outputDir = path.resolve(
  require.resolve('@asap-hub/crn-messages/package.json'),
  '../build-templates',
);
const config: Configuration = configFactory(appOrigin, outputDir);

config.resolve = {
  ...config.resolve,
  fallback: {
    ...config.resolve?.fallback,
    'react/jsx-runtime': 'react/jsx-runtime.js',
    'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
  },
};

export default config;
