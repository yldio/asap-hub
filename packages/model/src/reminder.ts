import { ListResponse } from './common';
import { EventResponse } from './event';
import { ResearchOutputResponse } from './research-output';

type ReminderEntity = 'Research Output' | 'Event';

const researchOutputReminderTypes = [
  'Published',
  'Share',
] as const;
const eventReminderTypes = [
  'New'
] as const;
type ResearchOutputReminderType = typeof researchOutputReminderTypes[number];
type EventReminderType = typeof eventReminderTypes[number];
type ReminderType = ResearchOutputReminderType | EventReminderType
interface Reminder {
  entity: ReminderEntity;
  type: ReminderType;
  data: unknown;
}

interface ResearchOutputReminder extends Reminder {
  entity: "Research Output"
  type: ResearchOutputReminderType
}

interface EventReminder extends Reminder {
  entity: "Event"
  type: EventReminderType
}

export interface ResearchOutputPublishedReminder extends ResearchOutputReminder {
  entity: 'Research Output';
  type: 'Published';
  data: {
    researchOutput: ResearchOutputResponse;
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
  }
}

export type ReminderResponse =
  | ResearchOutputPublishedReminder
  | ResearchOutputShareReminder
  | EventNewReminder;

export type ListReminderResponse = ListResponse<ReminderResponse>;
