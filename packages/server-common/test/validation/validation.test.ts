import { JSONSchemaType } from 'ajv';
import { validateInput } from '../../src/validation';

describe('Validate Input', () => {
  const testSchema: JSONSchemaType<{ param?: number }> = {
    type: 'object',
    properties: {
      param: { type: 'number', nullable: true },
    },
    additionalProperties: false,
  };

  const validateTestSchema = validateInput(testSchema, {
    skipNull: true,
    coerce: true,
  });

  test('Should throw a validation error', async () => {
    expect(() => validateTestSchema({ param: 'invalid' })).toThrow(
      expect.objectContaining({
        data: [
          {
            instancePath: '/param',
            schemaPath: '#/properties/param/type',
            keyword: 'type',
            params: {
              type: 'number',
            },
            message: 'must be number',
          },
        ],
        output: expect.objectContaining({
          payload: {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Validation error',
          },
        }),
      }),
    );
  });

  test('Should return validated parameters', async () => {
    expect(validateTestSchema({ param: 12345 })).toEqual({ param: 12345 });
  });

  test('Should return validated params with skipNull', () => {
    const validateTestSchema = validateInput(testSchema, {
      skipNull: true,
    });
    expect(validateTestSchema({ param: null })).toEqual({});
  });
  test('Should return validated params with nullableKeys', () => {
    const validateTestSchema = validateInput(testSchema, {
      skipNull: true,
      nullableKeys: ['param'],
    });
    expect(validateTestSchema({ param: null })).toEqual({ param: null });
  });

  describe('allErrors', () => {
    const twoFieldSchema: JSONSchemaType<{ one?: string; two?: string }> = {
      type: 'object',
      properties: {
        one: { type: 'string', pattern: '^ok$', nullable: true },
        two: { type: 'string', pattern: '^ok$', nullable: true },
      },
      additionalProperties: false,
    };
    const bothInvalid = { one: 'no', two: 'no' };

    const paths = (validate: (data: Record<string, unknown>) => unknown) => {
      try {
        validate(bothInvalid);
        return [];
      } catch (error) {
        return ((error as { data: { instancePath: string }[] }).data ?? []).map(
          ({ instancePath }) => instancePath,
        );
      }
    };

    // Off by default, and it has to stay that way: validationErrorsAreSupported
    // is all-or-nothing on the returned paths, so reporting more errors changes
    // how every existing consumer behaves.
    test('Should report only the first failure by default', () => {
      expect(paths(validateInput(twoFieldSchema))).toEqual(['/one']);
    });

    test('Should report every failure when opted in', () => {
      expect(paths(validateInput(twoFieldSchema, { allErrors: true }))).toEqual(
        ['/one', '/two'],
      );
    });

    // The instances are cached per option pair; asking for one combination must
    // not hand back the instance compiled for another.
    test('Should keep the setting separate from coerce', () => {
      expect(
        paths(validateInput(twoFieldSchema, { coerce: true, allErrors: true })),
      ).toEqual(['/one', '/two']);
      expect(paths(validateInput(twoFieldSchema, { coerce: true }))).toEqual([
        '/one',
      ]);
    });
  });
});
