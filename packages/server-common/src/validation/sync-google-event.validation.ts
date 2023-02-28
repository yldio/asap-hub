import { JSONSchemaType } from 'ajv';
import { NullableOptionalProperties } from '../utils';
import { validateInput } from './validation';

type Date = NullableOptionalProperties<{
  date?: string;
  dateTime?: string;
  timeZone?: string;
}>;
export type GoogleEvent = NullableOptionalProperties<{
  id: string;
  summary: string;
  description: string;
  organizer: {
    email?: string;
  };
  status: string;
  start: Date;
  end: Date;
}>;
const dateSchema: JSONSchemaType<Date> = {
  type: 'object',
  properties: {
    date: { type: 'string', nullable: true },
    dateTime: { type: 'string', nullable: true },
    timeZone: { type: 'string', nullable: true },
  },
  anyOf: [{ required: ['date'] }, { required: ['dateTime'] }],
};
const googleEventValidationSchema: JSONSchemaType<GoogleEvent> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    summary: { type: 'string' },
    description: { type: 'string' },
    organizer: {
      type: 'object',
      properties: { email: { type: 'string', nullable: true } },
    },
    start: dateSchema,
    end: dateSchema,
    status: { type: 'string' },
  },
  required: ['id', 'summary', 'status'],
};
export const validateGoogleEvent = validateInput(googleEventValidationSchema, {
  skipNull: false,
  coerce: true,
});
