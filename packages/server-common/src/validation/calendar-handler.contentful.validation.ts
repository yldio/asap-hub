import { JSONSchemaType } from 'ajv';
import { NullableOptionalProperties } from '../utils';
import { validateInput } from './validation';

type CalendarPayload = NullableOptionalProperties<{
  resourceId: string;
  sys: NullableOptionalProperties<{
    revision: number;
  }>;
  fields: NullableOptionalProperties<{
    name: NullableOptionalProperties<{ 'en-US': string }>;
    googleCalendarId: NullableOptionalProperties<{ 'en-US': string }>;
    color: NullableOptionalProperties<{ 'en-US': string }>;
    resourceId?: { 'en-US': string };
  }>;
}>;
const bodySchema: JSONSchemaType<CalendarPayload> = {
  type: 'object',
  properties: {
    resourceId: { type: 'string' },
    sys: {
      type: 'object',
      properties: {
        revision: {
          type: 'integer',
        },
      },
      required: ['revision'],
    },
    fields: {
      type: 'object',
      properties: {
        name: {
          type: 'object',
          properties: { 'en-US': { type: 'string' } },
          required: ['en-US'],
        },
        googleCalendarId: {
          type: 'object',
          properties: { 'en-US': { type: 'string' } },
          required: ['en-US'],
        },
        color: {
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
      required: ['name', 'googleCalendarId', 'color'],
    },
  },
  required: ['resourceId', 'fields', 'sys'],
};
export const validateBody = validateInput(bodySchema, {
  skipNull: false,
  coerce: true,
});
