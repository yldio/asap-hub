import { ListResponse } from '../common';

export type KeywordDataObject = {
  id: string;
  name: string;
};

export type ListKeywordsDataObject = ListResponse<KeywordDataObject>;

export type KeywordResponse = KeywordDataObject;
export type ListKeywordsResponse = ListResponse<KeywordResponse>;

export type KeywordCreateDataObject = Omit<KeywordDataObject, 'id'>;
