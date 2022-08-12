import { sentryWrapperImpl } from '@asap-hub/server-common';
import { Handler } from 'aws-lambda';
import {
  currentRevision,
  environment,
  sentryDsn,
  sentryTraceSampleRate,
} from '../config';

export const sentryWrapper = (handler: Handler): Handler => {
  const config = {
    currentRevision,
    environment,
    sentryDsn,
    sentryTraceSampleRate,
  };

  return sentryWrapperImpl(handler, config);
};
