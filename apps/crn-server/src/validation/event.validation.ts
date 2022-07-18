import {
  fetchOptionsValidationSchema,
  validateInput,
} from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';
import { FetchEventsOptions } from '../controllers/events';

const eventFetchValidationSchema: JSONSchemaType<FetchEventsOptions> = {
  type: 'object',
  properties: {
    ...fetchOptionsValidationSchema.properties,
    groupId: { type: 'string', nullable: true },
    sortBy: {
      type: 'string',
      enum: ['startDate', 'endDate'],
      default: 'startDate',
    },
    sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
    before: { type: 'string', format: 'date-time' },
    after: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  required: [],
  anyOf: [
    {
      required: ['before'],
    },
    {
      required: ['after'],
    },
  ],
  dependencies: {
    sortBy: ['sortOrder'],
    sortOrder: ['sortBy'],
  },
};

export const validateEventFetchParameters = validateInput(
  eventFetchValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

type EventParameters = {
  eventId: string;
};

const eventParametersValidationSchema: JSONSchemaType<EventParameters> = {
  type: 'object',
  properties: {
    eventId: { type: 'string' },
  },
  required: ['eventId'],
  additionalProperties: false,
};

export const validateEventParameters = validateInput(
  eventParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
