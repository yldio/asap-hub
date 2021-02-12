/* istanbul ignore file */
import { lightstep } from 'lightstep-opentelemetry-launcher-node';
import { lightstepToken } from './config';
import { Handler } from 'serverless-http';

const sdk = lightstep.configureOpenTelemetry({
  accessToken: lightstepToken,
  serviceName: 'test-server',
  serviceVersion: 'v0.0.1',
});
const starter = sdk.start();

export const handler: Handler = async (...args) => {
  await starter;
  return require('./handlers/api-handler').apiHandler(...args);
};

// Shutdown flushes any remaining spans before exit.
function shutdown() {
  sdk
    .shutdown()
    .then((err) => console.log('error shutting down', err))
    .finally(() => process.exit(0));
}
process.on('beforeExit', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
