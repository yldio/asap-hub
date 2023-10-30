import { ListResponse } from '../common';
import { EntityType } from './entity';

export type TagDataObject = {
  id: string;
  name: string;
};

export type ListTagsDataObject = ListResponse<TagDataObject>;

export type TagResponse = TagDataObject;
export type ListTagsResponse = ListResponse<TagResponse>;

export type TagCreateDataObject = Omit<TagDataObject, 'id'>;

export type FetchTagSearchFilter = {
  entityType?: EntityType[];
};
