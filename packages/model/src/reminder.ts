import { ListResponse } from './common';
import { EventResponse } from './event';
import { ResearchOutputDataObject } from './research-output';

type ReminderEntity = 'Research Output' | 'Event';

type ResearchOutputReminderType = 'Published' | 'Share';
type EventReminderType = 'Happening Today';
type ReminderType = ResearchOutputReminderType | EventReminderType;
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

export interface ResearchOutputPublishedReminder
  extends ResearchOutputReminder {
  entity: 'Research Output';
  type: 'Published';
  data: {
    researchOutputId: ResearchOutputDataObject['id'];
    documentType: ResearchOutputDataObject['documentType'];
    title: ResearchOutputDataObject['title'];
  };
}

export interface ResearchOutputShareReminder extends ResearchOutputReminder {
  entity: 'Research Output';
  type: 'Share';
  data: undefined;
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

export type ReminderDataObject =
  | ResearchOutputPublishedReminder
  | ResearchOutputShareReminder
  | EventHappeningTodayReminder;

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
