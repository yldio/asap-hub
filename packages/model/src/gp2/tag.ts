import { ListResponse } from '../common';

export type TagDataObject = {
  id: string;
  name: string;
};

export type ListTagsDataObject = ListResponse<TagDataObject>;

export type TagResponse = TagDataObject;
export type ListTagsResponse = ListResponse<TagResponse>;

export type TagCreateDataObject = Omit<TagDataObject, 'id'>;

export const getTagsNames = (tags?: TagDataObject[]) =>
  tags ? tags.map((tag) => tag.name) : [];
