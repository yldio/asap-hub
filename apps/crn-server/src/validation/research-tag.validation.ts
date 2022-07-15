import { JSONSchemaType } from 'ajv';
import { validateInput } from '.';
import { FetchResearchTagsOptions } from '../controllers/research-tags';

export const researchTagFetchOptionsValidationSchema: JSONSchemaType<FetchResearchTagsOptions> =
  {
    type: 'object',
    properties: {
      take: { type: 'number', nullable: true },
      skip: { type: 'number', nullable: true },
      filter: {
        type: 'object',
        properties: {
          entity: {
            enum: ['Research Output', 'User'],
            type: 'string',
            nullable: true,
          },
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
