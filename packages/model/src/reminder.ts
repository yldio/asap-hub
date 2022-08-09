import { ListResponse } from './common';
import { EventResponse } from './event';
import { ResearchOutputDataObject } from './research-output';

type ReminderEntity = 'Research Output' | 'Event';

const researchOutputReminderTypes = ['Published', 'Share'] as const;
const eventReminderTypes = ['New'] as const;

type ResearchOutputReminderType = typeof researchOutputReminderTypes[number];
type EventReminderType = typeof eventReminderTypes[number];
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

export interface EventNewReminder extends EventReminder {
  entity: 'Event';
  type: 'New';
  data: {
    event: EventResponse;
  };
}

export type ReminderDataObject =
  | ResearchOutputPublishedReminder
  | ResearchOutputShareReminder
  | EventNewReminder;

export type ListReminderDataObject = ListResponse<ReminderDataObject>;

export type FetchRemindersOptions = {
  userId: string;
};

export type ReminderResponse = {
  description: string;
  entity: ReminderEntity;
  href?: string;
  id: string;
};
export type ListReminderResponse = ListResponse<ReminderResponse>;
