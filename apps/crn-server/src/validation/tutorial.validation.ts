import { JSONSchemaType } from 'ajv';
import {
  NewsFrequency,
  FetchNewsOptions,
  newsFrequency,
} from '@asap-hub/model';
import {
  fetchOptionsValidationSchema,
  validateInput,
} from '@asap-hub/server-common';

const newsFetchValidationSchema: JSONSchemaType<
  Omit<FetchNewsOptions, 'filter'> & { filter?: NewsFrequency[] }
> = {
  type: 'object',
  properties: {
    ...fetchOptionsValidationSchema.properties,
    filter: {
      type: 'array',
      nullable: true,
      items: { enum: newsFrequency },
    },
  },
  additionalProperties: false,
};

export const validateNewsFetchParameters = validateInput(
  newsFetchValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

type TutorialParameters = {
  tutorialId: string;
};

const tutorialParametersValidationSchema: JSONSchemaType<TutorialParameters> = {
  type: 'object',
  properties: {
    tutorialId: { type: 'string' },
  },
  required: ['tutorialId'],
  additionalProperties: false,
};

export const validateTutorialParameters = validateInput(
  tutorialParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
