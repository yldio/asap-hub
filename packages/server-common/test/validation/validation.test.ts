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
});
