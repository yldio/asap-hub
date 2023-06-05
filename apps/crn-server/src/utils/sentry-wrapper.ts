import { sentryWrapperFactory } from '@asap-hub/server-common';
import { currentRevision, environment, sentryTraceSampleRate } from '../config';

export const sentryWrapper = sentryWrapperFactory({
  currentRevision,
  environment,
  sentryDsn: 'https://random@o1111815.ingest.sentry.io/6587137',
  sentryTraceSampleRate,
});
