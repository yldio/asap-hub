import Boom from '@hapi/boom';
import Ajv, { JSONSchemaType } from 'ajv';
import { NullableOptionalProperties } from '../utils/types';

const ajv = new Ajv();

// The below has to be declared as a function due to:
// https://github.com/ajv-validator/ajv/issues/1814
export function validateInput<T, B extends boolean>(
  schema: JSONSchemaType<T>,
  options?: {
    skipNull?: B;
  },
): (
  data: any,
) => B extends true ? NonNullable<T> : NullableOptionalProperties<T>;
export function validateInput<T>(
  schema: JSONSchemaType<T>,
  options?: {
    skipNull?: boolean;
  },
): (data: any) => NonNullable<T> | NullableOptionalProperties<T> {
  const validation = ajv.compile(schema);

  return (data) => {
    if (validation(data)) {
      if (options?.skipNull) {
        return Object.entries(data).reduce(
          (obj, [key, val]) => (val === null ? obj : { ...obj, [key]: val }),
          {},
        ) as NonNullable<T>;
      }

      return data as NullableOptionalProperties<T>;
    }

    const errors = validation.errors;

    throw Boom.badRequest(
      `Error "${errors?.[0]?.propertyName}": ${errors?.[0]?.message}`,
      {
        details: errors,
      },
    );
  };
}
