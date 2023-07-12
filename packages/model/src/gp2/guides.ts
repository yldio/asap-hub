import { ListResponse } from '../common';

export type GuideBlockDataObject = {
  bodyText: string;
  title?: string;
  linkUrl?: string;
  linkText?: string;
  id: string;
};
export type GuideDataObject = {
  id: string;
  title: string;
  icon: string;
  description: GuideBlockDataObject[];
};

export type ListGuideDataObject = ListResponse<GuideDataObject>;

export type GuideResponse = GuideDataObject;

export type ListGuideResponse = ListResponse<GuideResponse>;
