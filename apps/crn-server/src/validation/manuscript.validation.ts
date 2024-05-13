import { manuscriptPostRequestSchema } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type ManuscriptParameters = {
  manuscriptId: string;
};

const manuscriptParametersValidationSchema: JSONSchemaType<ManuscriptParameters> =
  {
    type: 'object',
    properties: {
      manuscriptId: { type: 'string' },
    },
    required: ['manuscriptId'],
    additionalProperties: false,
  };

export const validateManuscriptParameters = validateInput(
  manuscriptParametersValidationSchema,
  {
    skipNull: false,
    coerce: false,
  },
);

export const validateManuscriptPostRequestParameters = validateInput(
  manuscriptPostRequestSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
