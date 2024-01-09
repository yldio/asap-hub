import { ListResponse } from '../common';
import { OutputDataObject } from './output';

type ReminderEntity = 'Output';

type OutputReminderType = 'Published';

type ReminderType = OutputReminderType;

interface Reminder {
  id: string;
  entity: ReminderEntity;
  type: ReminderType;
  data: unknown;
}

interface ResearchOutputReminder extends Reminder {
  entity: 'Output';
  type: OutputReminderType;
}

export interface OutputPublishedReminder extends ResearchOutputReminder {
  data: {
    outputId: OutputDataObject['id'];
    documentType: OutputDataObject['documentType'];
    title: OutputDataObject['title'];
    addedDate: OutputDataObject['addedDate'];
    statusChangedBy: string;
    associationType: 'project' | 'working group';
    associationName: string;
  };
}

export type ReminderDataObject = OutputPublishedReminder;

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
