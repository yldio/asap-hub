import { ListResponse } from './common';

export type GuideContentDataObject = {
  title: string;
  linkText: string;
  linkUrl: string;
  text: string;
};

export type GuideContentResponse = GuideContentDataObject;

export type GuideDataObject = {
  title: string;
  icon?: string;
  content: GuideContentResponse[];
};

export type GuideResponse = GuideDataObject;
export type ListGuideResponse = ListResponse<GuideResponse>;
