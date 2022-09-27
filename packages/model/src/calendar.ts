import { FetchPaginationOptions, ListResponse } from './common';

export const googleLegacyCalendarColor = [
  '#B1365F',
  '#5C1158',
  '#711616',
  '#691426',
  '#BE6D00',
  '#B1440E',
  '#853104',
  '#8C500B',
  '#754916',
  '#88880E',
  '#AB8B00',
  '#856508',
  '#28754E',
  '#1B887A',
  '#28754E',
  '#0D7813',
  '#528800',
  '#125A12',
  '#2F6309',
  '#2F6213',
  '#0F4B38',
  '#5F6B02',
  '#4A716C',
  '#6E6E41',
  '#29527A',
  '#2952A3',
  '#4E5D6C',
  '#5A6986',
  '#182C57',
  '#060D5E',
  '#113F47',
  '#7A367A',
  '#5229A3',
  '#865A5A',
  '#705770',
  '#23164E',
  '#5B123B',
  '#42104A',
  '#875509',
  '#8D6F47',
  '#6B3304',
  '#333333',
] as const;

export type GoogleLegacyCalendarColor =
  typeof googleLegacyCalendarColor[number];

export interface CalendarDataObject {
  id: string;
  googleCalendarId: string;
  color: GoogleLegacyCalendarColor;
  name: string;
  syncToken?: string | null;
  resourceId?: string | null;
  expirationDate?: number | null;
  version: number;
}

export type CalendarCreateDataObject = Omit<
  CalendarDataObject,
  'version' | 'id'
>;

export type CalendarUpdateDataObject = Partial<CalendarCreateDataObject>;

export type ListCalendarDataObject = ListResponse<CalendarDataObject>;

export interface CalendarResponse {
  id: string;
  name: string;
  color: GoogleLegacyCalendarColor;
}

export type ListCalendarResponse = ListResponse<CalendarResponse>;

export interface CalendarUpdateRequest {
  resourceId?: string | null;
  expirationDate?: number | null;
}

export type FetchCalendarOptions = FetchPaginationOptions;

export const isGoogleLegacyCalendarColor = (
  data: string | null,
): data is GoogleLegacyCalendarColor =>
  googleLegacyCalendarColor.includes(data as GoogleLegacyCalendarColor);
