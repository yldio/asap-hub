import { FetchOptions, ListResponse } from './common';

export type ResourceTypeDataObject = {
  readonly id: string;
  readonly name: string;
};

export type ListResourceTypeDataObject = ListResponse<ResourceTypeDataObject>;

export type ResourceTypeResponse = ResourceTypeDataObject;

export type ListResourceTypeResponse = ListResponse<ResourceTypeResponse>;

export type FetchResourceTypesOptions = FetchOptions;
