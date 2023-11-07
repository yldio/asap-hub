import { Payload } from '@asap-hub/algolia';
import { EventResponse } from '@asap-hub/model';

export const addTagsToEvents = <T extends Payload>(
  data: T['data'],
): EventResponse & { _tags: string[] } => {
  if ('tags' in data) {
    return { ...data, _tags: data.tags };
  }

  return { ...(data as unknown as EventResponse), _tags: [] };
};
