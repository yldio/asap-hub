import { JSONSchemaType } from 'ajv';
import { NullableOptionalProperties } from '../utils';
import { validateInput } from './validation';

type RestCalendar = NullableOptionalProperties<{
  googleCalendarId: {
    'en-US': string;
  };
  resourceId?: {
    'en-US': string;
  };
}>;

type CalendarPayload = NullableOptionalProperties<{
  resourceId: string;
  sys: {
    type: string;
    id: string;
    revision: number;
  };
  fields: NullableOptionalProperties<RestCalendar>;
}>;
const bodySchema: JSONSchemaType<CalendarPayload> = {
  type: 'object',
  properties: {
    resourceId: { type: 'string' },
    sys: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        id: { type: 'string' },
        revision: { type: 'number' },
      },
      required: ['id', 'type', 'revision'],
    },
    fields: {
      type: 'object',
      properties: {
        googleCalendarId: {
          type: 'object',
          properties: { 'en-US': { type: 'string' } },
          required: ['en-US'],
        },
        resourceId: {
          type: 'object',
          properties: { 'en-US': { type: 'string' } },
          required: ['en-US'],
          nullable: true,
        },
      },
      required: ['googleCalendarId'],
    },
  },
  required: ['resourceId', 'sys', 'fields'],
};
export const validateBody = validateInput(bodySchema, {
  skipNull: false,
  coerce: true,
});
