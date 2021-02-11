/* istanbul ignore file */
import { lightstep } from 'lightstep-opentelemetry-launcher-node';
import { lightstepToken } from './config';

const sdk = lightstep.configureOpenTelemetry({
  accessToken: lightstepToken,
  serviceName: 'test-server',
  serviceVersion: 'v0.0.1',
});

// For auto-instrumentation to work,
// the SDK must be started before any
// other packages are loaded.
sdk.start().then(() => {
  require('./server');
});

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
