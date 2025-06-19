import { ListResponse } from './common';

export type CategoryDataObject = {
  id: string;
  name: string;
};
export type ListCategoryDataObject = ListResponse<CategoryDataObject>;

export type CategoryResponse = CategoryDataObject;
export type ListCategoriesResponse = ListResponse<CategoryResponse>;
