import { Payload } from '@asap-hub/algolia';

export const addTagsFunction = <T extends Payload>(
  data: T['data'],
): T['data'] & { _tags: string[] } => {
  if ('tags' in data) {
    const tags = data.tags?.map((tag) => {
      if (typeof tag === 'object' && 'name' in tag) {
        return tag.name;
      }
      return tag;
    });

    return { ...data, _tags: tags || [] };
  }
  return { ...data, _tags: [] };
};
