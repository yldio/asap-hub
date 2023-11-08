import { Payload } from '@asap-hub/algolia';

export const addTagsFunction = <T extends Payload>(
  data: T['data'],
): T['data'] & { _tags: string[] } => {
  if ('tags' in data) {
    return { ...data, _tags: data.tags };
  }

  if ('expertiseAndResourceTags' in data) {
    return { ...data, _tags: data.expertiseAndResourceTags };
  }

  return { ...data, _tags: [] };
};
