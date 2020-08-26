import Joi from '@hapi/joi';
import { validate } from '../../src/framework/lambda';

test('validate throws on error', () => {
  expect(() =>
    validate('body', 42, Joi.string().required()),
  ).toThrowErrorMatchingInlineSnapshot(
    `"Error \\"body\\": \\"value\\" must be a string"`,
  );
});

test('validate returns on success', () => {
  expect(validate('body', '42', Joi.string().required())).toEqual('42');
});
