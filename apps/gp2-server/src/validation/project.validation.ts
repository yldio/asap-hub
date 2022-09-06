import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type ProjectParameters = {
  projectId: string;
};

const projectParametersValidationSchema: JSONSchemaType<ProjectParameters> = {
  type: 'object',
  properties: {
    projectId: { type: 'string' },
  },
  required: ['projectId'],
  additionalProperties: false,
};

export const validateProjectParameters = validateInput(
  projectParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
