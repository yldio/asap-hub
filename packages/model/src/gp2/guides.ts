import { ListResponse } from '../common';

export type GuideDescriptionDataObject = {
  id: string;
  title: string;
  //   description: GuideBlock;
};

export type ListAnnouncementsDataObject =
  ListResponse<GuideDescriptionDataObject>;

export type GuideDescriptionResponse = GuideDescriptionDataObject;

export type ListAnnouncementsResponse = ListResponse<GuideDescriptionResponse>;
