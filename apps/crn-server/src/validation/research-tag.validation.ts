import { FetchResearchTagsOptions } from '@asap-hub/model';
import { JSONSchemaType } from 'ajv';
import { fetchOptionsValidationSchema, validateInput } from '@asap-hub/server-common';

export const researchTagFetchOptionsValidationSchema: JSONSchemaType<FetchResearchTagsOptions> =
  {
    type: 'object',
    properties: {
    ...fetchOptionsValidationSchema.properties,
      filter: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            nullable: true,
          },
        },
        nullable: true,
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  };

export const validateResearchTagFetchPaginationOptions = validateInput(
  researchTagFetchOptionsValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
