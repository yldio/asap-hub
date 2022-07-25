import {
  NullableOptionalProperties,
  validateInput,
} from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type RestCalendar = NullableOptionalProperties<{
  googleCalendarId: {
    iv: string;
  };
  resourceId?: {
    iv: string;
  };
}>;
const calendarSchema: JSONSchemaType<RestCalendar> = {
  type: 'object',
  properties: {
    googleCalendarId: {
      type: 'object',
      properties: { iv: { type: 'string' } },
      required: ['iv'],
    },
    resourceId: {
      type: 'object',
      properties: { iv: { type: 'string' } },
      required: ['iv'],
      nullable: true,
    },
  },
  required: ['googleCalendarId'],
};
type CalendarPayload = NullableOptionalProperties<{
  type: string;
  payload: NullableOptionalProperties<{
    id: string;
    data: RestCalendar;
    dataOld?: RestCalendar;
    version: number;
  }>;
}>;
const bodySchema: JSONSchemaType<CalendarPayload> = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    payload: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        data: calendarSchema,
        dataOld: { ...calendarSchema, nullable: true },
        version: { type: 'number' },
      },
      required: ['data', 'id', 'version'],
    },
  },
  required: ['type', 'payload'],
};
export const validateBody = validateInput(bodySchema, {
  skipNull: false,
  coerce: true,
});
