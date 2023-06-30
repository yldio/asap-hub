import { ListResponse } from './common';
import { EventResponse } from './event';
import {
  ResearchOutputDraftDataObject,
  ResearchOutputPublishedDataObject,
} from './research-output';

type ReminderEntity = 'Research Output' | 'Event';

type ResearchOutputReminderType = 'Published' | 'Draft' | 'In Review';

export type EventReminderType =
  | 'Happening Today'
  | 'Happening Now'
  | 'Video Updated'
  | 'Presentation Updated'
  | 'Notes Updated'
  | 'Share Presentation'
  | 'Publish Material'
  | 'Upload Presentation';
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

export interface ReminderEventResponse extends EventResponse {
  videoRecordingUpdatedAt: string;
  presentationUpdatedAt: string;
  notesUpdatedAt: string;
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
    researchOutputId: ResearchOutputPublishedDataObject['id'];
    documentType: ResearchOutputPublishedDataObject['documentType'];
    title: ResearchOutputPublishedDataObject['title'];
    addedDate: ResearchOutputPublishedDataObject['addedDate'];
  };
}

export interface ResearchOutputDraftReminder extends ResearchOutputReminder {
  entity: 'Research Output';
  type: 'Draft';
  data: {
    researchOutputId: ResearchOutputDraftDataObject['id'];
    title: ResearchOutputDraftDataObject['title'];
    addedDate: ResearchOutputDraftDataObject['created'];
    createdBy: string;
    associationType: 'team' | 'working group';
    associationName: string;
  };
}

export interface ResearchOutputInReviewReminder extends ResearchOutputReminder {
  entity: 'Research Output';
  type: 'In Review';
  data: {
    researchOutputId: ResearchOutputDraftDataObject['id'];
    title: ResearchOutputDraftDataObject['title'];
    documentType: ResearchOutputPublishedDataObject['documentType'];
    addedDate: ResearchOutputDraftDataObject['created'];
    associationType: 'team' | 'working group';
    associationName: string;
    reviewRequestedBy: string;
  };
}

export interface EventHappeningTodayReminder extends EventReminder {
  entity: 'Event';
  type: 'Happening Today';
  data: {
    eventId: ReminderEventResponse['id'];
    title: ReminderEventResponse['title'];
    startDate: ReminderEventResponse['startDate'];
  };
}

export interface EventHappeningNowReminder extends EventReminder {
  entity: 'Event';
  type: 'Happening Now';
  data: {
    eventId: ReminderEventResponse['id'];
    title: ReminderEventResponse['title'];
    startDate: ReminderEventResponse['startDate'];
    endDate: ReminderEventResponse['endDate'];
  };
}

export interface SharePresentationReminder extends EventReminder {
  entity: 'Event';
  type: 'Share Presentation';
  data: {
    pmId?: string;
    eventId: ReminderEventResponse['id'];
    title: ReminderEventResponse['title'];
    endDate: ReminderEventResponse['endDate'];
  };
}

export interface PublishMaterialReminder extends EventReminder {
  entity: 'Event';
  type: 'Publish Material';
  data: {
    eventId: ReminderEventResponse['id'];
    title: ReminderEventResponse['title'];
    endDate: ReminderEventResponse['endDate'];
  };
}

export interface UploadPresentationReminder extends EventReminder {
  entity: 'Event';
  type: 'Upload Presentation';
  data: {
    eventId: ReminderEventResponse['id'];
    title: ReminderEventResponse['title'];
    endDate: ReminderEventResponse['endDate'];
  };
}

export interface VideoEventReminder extends EventReminder {
  entity: 'Event';
  type: 'Video Updated';
  data: {
    eventId: ReminderEventResponse['id'];
    title: ReminderEventResponse['title'];
    videoRecordingUpdatedAt: ReminderEventResponse['videoRecordingUpdatedAt'];
  };
}

export interface EventNotesReminder extends EventReminder {
  entity: 'Event';
  type: 'Notes Updated';
  data: {
    eventId: ReminderEventResponse['id'];
    title: ReminderEventResponse['title'];
    notesUpdatedAt: ReminderEventResponse['notesUpdatedAt'];
  };
}

export interface PresentationUpdatedReminder extends EventReminder {
  entity: 'Event';
  type: 'Presentation Updated';
  data: {
    eventId: ReminderEventResponse['id'];
    title: ReminderEventResponse['title'];
    presentationUpdatedAt: ReminderEventResponse['presentationUpdatedAt'];
  };
}

export type ReminderDataObject =
  | ResearchOutputPublishedReminder
  | ResearchOutputDraftReminder
  | ResearchOutputInReviewReminder
  | EventHappeningTodayReminder
  | EventHappeningNowReminder
  | VideoEventReminder
  | PresentationUpdatedReminder
  | EventNotesReminder
  | SharePresentationReminder
  | PublishMaterialReminder
  | UploadPresentationReminder;

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
