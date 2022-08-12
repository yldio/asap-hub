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
    currentRevision: currentRevision || '',
    environment: environment || '',
    sentryDsn: sentryDsn || '',
    sentryTraceSampleRate: sentryTraceSampleRate || 1.0,
  };

  return sentryWrapperImpl(handler, config);
};
