import { EventDataObject } from '@asap-hub/model';

export const addTagsToEvents = (
  data: EventDataObject,
): EventDataObject & { _tags: string[] } => ({
  ...data,
  _tags: data.tags,
});
