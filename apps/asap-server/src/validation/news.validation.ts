import { JSONSchemaType } from 'ajv';
import { validateInput } from './';

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
