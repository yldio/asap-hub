import { sentryWrapperFactory } from '@asap-hub/server-common/build';
import { Handler } from 'aws-lambda';
import {
  currentRevision,
  environment,
  sentryDsn,
  sentryTraceSampleRate,
} from '../config';

export const sentryWrapper = (handler: Handler): Handler => {
  const wrapper = sentryWrapperFactory({
    currentRevision,
    environment,
    sentryDsn,
    sentryTraceSampleRate,
  });

  return wrapper(handler);
};
