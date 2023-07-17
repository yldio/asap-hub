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

type NewsParameters = {
  newsId: string;
};

const newsParametersValidationSchema: JSONSchemaType<NewsParameters> = {
  type: 'object',
  properties: {
    newsId: { type: 'string' },
  },
  required: ['newsId'],
  additionalProperties: false,
};

export const validateNewsParameters = validateInput(
  newsParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
