import {
  FetchResearchThemesOptions,
  ResearchThemeType,
  researchThemeTypes,
} from '@asap-hub/model';
import {
  fetchOptionsValidationSchema,
  validateInput,
} from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

const researchThemeFetchValidationSchema: JSONSchemaType<
  Omit<FetchResearchThemesOptions, 'filter'> & { types?: ResearchThemeType[] }
> = {
  type: 'object',
  properties: {
    ...fetchOptionsValidationSchema.properties,
    types: {
      type: 'array',
      items: { enum: researchThemeTypes },
      nullable: true,
    },
  },
  additionalProperties: false,
  required: [],
};

export const validateResearchThemeFetchParameters = validateInput(
  researchThemeFetchValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
