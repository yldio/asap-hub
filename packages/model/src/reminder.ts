import { ListResponse } from './common';
import { ResearchOutputResponse } from './research-output';

type ReminderArea = 'Research Output' | 'Events';

export const reminderTypes = [
  'ResearchOutputPublished',
  'ResearchOutputShare',
] as const;

export type ReminderType = typeof reminderTypes[number];

interface Reminder {
  area: ReminderArea;
  type: ReminderType;
  data: unknown;
}

export interface ResearchOutputPublishedReminder extends Reminder {
  area: 'Research Output';
  type: 'ResearchOutputPublished';
  data: {
    researchOutput: ResearchOutputResponse;
  };
}

export interface ResearchOutputShareReminder extends Reminder {
  area: 'Research Output';
  type: 'ResearchOutputShare';
}

export type ReminderResponse =
  | ResearchOutputPublishedReminder
  | ResearchOutputShareReminder;

export type ListReminderResponse = ListResponse<ReminderResponse>;
