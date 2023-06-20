import { contentfulEnvId } from '../config';

export const getCalendarSubscriptionId = (id: string): string =>
  `contentful__${contentfulEnvId}__${id}`;
