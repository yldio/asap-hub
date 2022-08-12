import { sentryWrapperFactory } from '@asap-hub/server-common/build';
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
