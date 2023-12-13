import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type ReminderParameters = {
  timezone: string;
};

const reminderParametersValidationSchema: JSONSchemaType<ReminderParameters> = {
  type: 'object',
  properties: {
    timezone: { type: 'string' },
  },
  required: ['timezone'],
  additionalProperties: false,
};

export const validateReminderParameters = validateInput(
  reminderParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
