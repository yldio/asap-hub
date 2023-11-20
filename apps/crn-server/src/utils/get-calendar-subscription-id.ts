import { contentfulEnvId } from '../config';

export const getCalendarSubscriptionId = (id: string) =>
  `contentful__${contentfulEnvId}__${id}`;
