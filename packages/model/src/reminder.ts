import { ListResponse } from './common';
import { EventResponse } from './event';

type ReminderEntity = 'Research Output' | 'Event';

const researchOutputReminderTypes = ['Published', 'Share'] as const;
const eventReminderTypes = ['New'] as const;
type ResearchOutputReminderType = typeof researchOutputReminderTypes[number];
type EventReminderType = typeof eventReminderTypes[number];
type ReminderType = ResearchOutputReminderType | EventReminderType;
interface Reminder {
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
    researchOutputId: string;
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

export type ListReminderDataObject = ListResponse<ReminderResponse>;

export type FetchRemindersOptions = {
  userId: string;
};

export type ReminderResponse = ReminderDataObject;
export type ListReminderResponse = ListResponse<ReminderResponse>;
