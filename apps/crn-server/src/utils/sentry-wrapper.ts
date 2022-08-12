import { sentryWrapperFactory } from '@asap-hub/server-common';
import {
  currentRevision,
  environment,
  sentryDsn,
  sentryTraceSampleRate,
} from '../config';

export const sentryWrapper = sentryWrapperFactory({
  currentRevision,
  environment,
  sentryDsn,
  sentryTraceSampleRate,
});
