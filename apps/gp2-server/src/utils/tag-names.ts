import { TagDataObject } from '@asap-hub/model/src/gp2';

export const getTagsNames = (tags?: TagDataObject[]) =>
  tags ? tags.map((tag) => tag.name) : [];
