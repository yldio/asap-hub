import Boom from '@hapi/boom';
import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import {
  FetchOptions,
  FetchPaginationOptions,
  NullableOptionalProperties,
} from '../utils/types';

const ajv = new Ajv({ useDefaults: true });
const ajvCoerced = new Ajv({ coerceTypes: 'array', useDefaults: true });
addFormats(ajv, ['date-time']);
addFormats(ajvCoerced, ['date-time']);

// The below has to be declared as a function due to:
// https://github.com/ajv-validator/ajv/issues/1814
export function validateInput<T, B extends boolean>(
  schema: JSONSchemaType<T>,
  options?: {
    skipNull?: B;
    coerce?: boolean;
  },
): (
  data: Record<string, unknown>,
) => B extends true ? NonNullable<T> : NullableOptionalProperties<T>;
// eslint-disable-next-line no-redeclare
export function validateInput<T>(
  schema: JSONSchemaType<T>,
  options?: {
    skipNull?: boolean;
    coerce?: boolean;
  },
): (
  data: Record<string, unknown>,
) => NonNullable<T> | NullableOptionalProperties<T> {
  const ajvValidation = (options?.coerce ? ajvCoerced : ajv).compile(schema);

  return (data) => {
    if (validate(ajvValidation, data)) {
      if (options?.skipNull) {
        return Object.entries(data).reduce(
          (obj, [key, val]) => (val === null ? obj : { ...obj, [key]: val }),
          {} as NonNullable<T>,
        );
      }

      return data;
    }

    const { errors } = ajvValidation;

    throw Boom.badRequest(`Validation error`, errors);
  };
}

// AJV requires setting every optional property nullable in the validatio schema
// however marking it as nullable does not enforce the null types
// The below wrapper-type will make every optional property nullable too
// see: https://github.com/ajv-validator/ajv/issues/1664
const validate = <T>(
  ajvValidation: ValidateFunction<T>,
  data: Record<string, unknown>,
): data is NullableOptionalProperties<T> => ajvValidation(data);

export const fetchOptionsValidationSchema: JSONSchemaType<FetchOptions> = {
  type: 'object',
  properties: {
    take: { type: 'number', nullable: true },
    skip: { type: 'number', nullable: true },
    search: { type: 'string', nullable: true },
    filter: {
      type: 'array',
      items: { type: 'string' },
      nullable: true,
    },
  },
  additionalProperties: false,
};

export const validateFetchOptions = validateInput(
  fetchOptionsValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

export const fetchPaginationOptionsValidationSchema: JSONSchemaType<FetchPaginationOptions> =
  {
    type: 'object',
    properties: {
      take: { type: 'number', nullable: true },
      skip: { type: 'number', nullable: true },
    },
    additionalProperties: false,
  };

export const validateFetchPaginationOptions = validateInput(
  fetchPaginationOptionsValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
