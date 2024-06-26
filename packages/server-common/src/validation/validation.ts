import {
  FetchAnalyticsOptions,
  FetchOptions,
  FetchPaginationOptions,
  gp2,
} from '@asap-hub/model';
import Boom from '@hapi/boom';
import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { NullableOptionalProperties } from '../utils/types';

const ajv = new Ajv({ useDefaults: true });
const ajvCoerced = new Ajv({ coerceTypes: 'array', useDefaults: true });
addFormats(ajv, ['date-time']);
addFormats(ajvCoerced, ['date-time']);

// AJV requires setting every optional property nullable in the validatio schema
// however marking it as nullable does not enforce the null types
// The below wrapper-type will make every optional property nullable too
// see: https://github.com/ajv-validator/ajv/issues/1664
const validate = <T>(
  ajvValidation: ValidateFunction<T>,
  data: Record<string, unknown>,
): data is NullableOptionalProperties<T> => ajvValidation(data);

// The below has to be declared as a function due to:
// https://github.com/ajv-validator/ajv/issues/1814
export function validateInput<T, B extends boolean>(
  schema: JSONSchemaType<T>,
  options?: {
    skipNull?: B;
    coerce?: boolean;
    nullableKeys?: string[];
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
    nullableKeys?: string[];
  },
): (data: Record<string, T>) => NonNullable<T> | NullableOptionalProperties<T> {
  const ajvValidation = (options?.coerce ? ajvCoerced : ajv).compile(schema);

  return (data) => {
    if (validate(ajvValidation, data)) {
      if (options?.skipNull) {
        return Object.entries(data).reduce(
          (obj, [key, val]) =>
            val === null && !options?.nullableKeys?.includes(key)
              ? obj
              : { ...obj, [key]: val },
          {} as NonNullable<T>,
        );
      }

      return data;
    }

    const { errors } = ajvValidation;

    throw Boom.badRequest(`Validation error`, errors);
  };
}

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

export const fetchUsersOptionsValidationSchema: JSONSchemaType<gp2.FetchUsersApiOptions> =
  {
    type: 'object',
    properties: {
      take: { type: 'number', nullable: true },
      skip: { type: 'number', nullable: true },
      search: { type: 'string', nullable: true },
      filter: {
        type: 'object',
        properties: {
          regions: {
            type: 'array',
            items: { type: 'string', enum: gp2.userRegions },
            nullable: true,
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
          projects: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
          workingGroups: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
          userIds: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
          code: { type: 'string', nullable: true },
          onlyOnboarded: { type: 'boolean', nullable: true, default: true },
          hidden: { type: 'boolean', nullable: true },
        },
        nullable: true,
      },
    },
    additionalProperties: false,
  };

export const fetchExternalUsersOptionsValidationSchema: JSONSchemaType<gp2.FetchExternalUsersOptions> =
  {
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

export const validateFetchUsersOptions = validateInput(
  fetchUsersOptionsValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

export const validateFetchExternalUsersOptions = validateInput(
  fetchExternalUsersOptionsValidationSchema,
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

export const fetchAnalyticsOptionsValidationSchema: JSONSchemaType<FetchAnalyticsOptions> =
  {
    type: 'object',
    properties: {
      take: { type: 'number', nullable: true },
      skip: { type: 'number', nullable: true },
      filter: {
        type: 'object',
        properties: {
          timeRange: { type: 'string', nullable: true },
          documentCategory: { type: 'string', nullable: true },
        },
        nullable: true,
      },
    },
    additionalProperties: false,
  };

export const validateFetchAnalyticsOptions = validateInput(
  fetchAnalyticsOptionsValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
