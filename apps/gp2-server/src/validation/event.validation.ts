import { gp2 } from '@asap-hub/model';
import {
  fetchOptionsValidationSchema,
  validateInput,
} from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

const eventFetchValidationSchema: JSONSchemaType<gp2.FetchEventsOptions> = {
  type: 'object',
  properties: {
    ...fetchOptionsValidationSchema.properties,
    filter: {
      type: 'object',
      properties: {
        workingGroupId: { type: 'string', nullable: true },
        projectId: { type: 'string', nullable: true },
      },
      nullable: true,
    },
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
