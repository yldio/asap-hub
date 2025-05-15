import { ContentGeneratorRequest } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

const generateContentRequestValidationSchema: JSONSchemaType<ContentGeneratorRequest> =
  {
    type: 'object',
    properties: {
      description: { type: 'string' },
    },
    required: ['description'],
    additionalProperties: false,
  };

export const validateGenerateContentRequestParameters = validateInput<
  ContentGeneratorRequest,
  true
>(generateContentRequestValidationSchema, {
  skipNull: true,
  coerce: true,
});
