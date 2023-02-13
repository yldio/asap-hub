import { EventStatus } from '@asap-hub/model';
import { Entity, Rest, RestPayload } from '../common';

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

  speakers?: { team: string[]; user: string[] }[];

  // Past event details
  notesPermanentlyUnavailable?: boolean;
  notes?: string;
  notesUpdatedAt?: string;
  videoRecordingPermanentlyUnavailable?: boolean;
  videoRecording?: string;
  videoRecordingUpdatedAt?: string;
  presentationPermanentlyUnavailable?: boolean;
  presentation?: string;
  presentationUpdatedAt?: string;
  meetingMaterialsPermanentlyUnavailable?: boolean;
  meetingMaterials?: {
    title: string;
    url: string;
  }[];

  // Future event details
  meetingLink?: string;
  hideMeetingLink?: boolean;
  thumbnail?: TThumbnail[];
  tags: string[];
}

export interface RestEvent extends Entity, Rest<Event> {}
export interface InputEvent extends Entity, RestPayload<Event> {}
