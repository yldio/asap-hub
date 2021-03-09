import { EventStatus } from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';
import { GraphqlCalendar } from './calendar';

type GoogleEventStatus = EventStatus;

export interface Event<TCalendar = string, TThumbnail = string> {
  googleId: string;
  title: string;
  description?: string;
  startDate: string;
  startDateTimeZone: string;
  endDate: string;
  endDateTimeZone: string;
  status: GoogleEventStatus;
  calendar: TCalendar[];

  hidden?: boolean;

  // Past event details
  notesLocked?: boolean;
  notes?: string;
  videoRecordingLocked?: boolean;
  videoRecording?: string;
  presentationLocked?: boolean;
  presentation?: string;
  meetingMaterialsLocked?: boolean;
  meetingMaterials?: {
    title: string;
    url: string;
    label?: string;
  }[];

  // Future event details
  meetingLink?: string;
  thumbnail?: TThumbnail[];
  tags: string[];
}

export interface RestEvent extends Entity, Rest<Event> {}
export interface GraphqlEvent
  extends Entity,
    Graphql<Event<GraphqlCalendar, Entity>> {}
