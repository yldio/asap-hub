import { JSONSchemaType } from 'ajv';
import { gp2 } from '@asap-hub/model';
import {
  fetchOptionsValidationSchema,
  validateInput,
} from '@asap-hub/server-common';

const newsFetchValidationSchema: JSONSchemaType<
  Omit<gp2.FetchNewsOptions, 'filter'> & { filter?: gp2.NewsType[] }
> = {
  type: 'object',
  properties: {
    ...fetchOptionsValidationSchema.properties,
    filter: {
      type: 'array',
      nullable: true,
      items: { enum: gp2.newsTypes },
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
