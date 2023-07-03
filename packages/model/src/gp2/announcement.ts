import { ListResponse } from '../common';

export type AnnouncementDataObject = {
  description: string;
  deadline: string;
  link?: string;
};

export type ListAnnouncementsDataObject = ListResponse<AnnouncementDataObject>;

export type AnnouncementResponse = AnnouncementDataObject;

export type ListAnnouncementsResponse = ListResponse<AnnouncementResponse>;
