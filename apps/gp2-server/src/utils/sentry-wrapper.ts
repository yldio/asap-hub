import { sentryWrapperFactory } from '@asap-hub/server-common';
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
