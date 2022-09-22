import { ListResponse } from './common';
import { EventResponse } from './event';
import { ResearchOutputDataObject } from './research-output';

type ReminderEntity = 'Research Output' | 'Event' | 'Event Material';

type ResearchOutputReminderType = 'Published';
type EventReminderType = 'Happening Today' | 'Happening Now';
type EventMaterialReminderType = 'Video';
type ReminderType =
  | ResearchOutputReminderType
  | EventReminderType
  | EventMaterialReminderType;
interface Reminder {
  id: string;
  entity: ReminderEntity;
  type: ReminderType;
  data: unknown;
}

interface ResearchOutputReminder extends Reminder {
  entity: 'Research Output';
  type: ResearchOutputReminderType;
}

interface EventReminder extends Reminder {
  entity: 'Event';
  type: EventReminderType;
}

interface EventMaterialReminder extends Reminder {
  entity: 'Event Material';
  type: EventMaterialReminderType;
}

export interface ResearchOutputPublishedReminder
  extends ResearchOutputReminder {
  entity: 'Research Output';
  type: 'Published';
  data: {
    researchOutputId: ResearchOutputDataObject['id'];
    documentType: ResearchOutputDataObject['documentType'];
    title: ResearchOutputDataObject['title'];
    addedDate: ResearchOutputDataObject['addedDate'];
  };
}

export interface EventHappeningTodayReminder extends EventReminder {
  entity: 'Event';
  type: 'Happening Today';
  data: {
    eventId: EventResponse['id'];
    title: EventResponse['title'];
    startDate: EventResponse['startDate'];
  };
}

export interface EventHappeningNowReminder extends EventReminder {
  entity: 'Event';
  type: 'Happening Now';
  data: {
    eventId: EventResponse['id'];
    title: EventResponse['title'];
    startDate: EventResponse['startDate'];
    endDate: EventResponse['endDate'];
  };
}

export interface VideoEventReminder extends EventMaterialReminder {
  entity: 'Event Material';
  type: 'Video';
  data: {
    eventId: EventResponse['id'];
    title: EventResponse['title'];
    startDate: EventResponse['startDate'];
    endDate: EventResponse['endDate'];
    videoRecordingUpdatedAt: EventResponse['videoRecordingUpdatedAt'];
  };
}

export type ReminderDataObject =
  | ResearchOutputPublishedReminder
  | EventHappeningTodayReminder
  | EventHappeningNowReminder;

export type ListReminderDataObject = ListResponse<ReminderDataObject>;

export type FetchRemindersOptions = {
  userId: string;
  timezone: string;
};

export type ReminderResponse = {
  description: string;
  entity: ReminderEntity;
  href?: string;
  id: string;
};
export type ListReminderResponse = ListResponse<ReminderResponse>;
