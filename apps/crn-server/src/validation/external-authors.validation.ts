import { JSONSchemaType } from 'ajv';
import { validateInput } from '.';

type ExternalAuthorsParameters = {
  name: string;
  orcid?: string;
};

const externalAuthorParametersValidationSchema: JSONSchemaType<ExternalAuthorsParameters> =
  {
    type: 'object',
    properties: {
      name: { type: 'string' },
      orcid: { type: 'string', nullable: true },
    },
    required: ['name'],
    additionalProperties: false,
  };

export const validateExternalAuthorParameters = validateInput(
  externalAuthorParametersValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
