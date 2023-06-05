import { createLink } from '@asap-hub/contentful';
import { Environment } from 'contentful-management';
import { logger } from './logs';

export const createCalendarLink = async (
  contentfulEnvironment: Environment,
  calendarId: string,
  errorText?: string,
) => {
  if (calendarId) {
    try {
      await contentfulEnvironment.getEntry(calendarId);
      return createLink(calendarId);
    } catch {
      logger(
        `Calendar ${calendarId} does not exist in contentful.${
          errorText ? ` ${errorText}` : ''
        }`,
        'ERROR',
      );
    }
  }

  return null;
};
