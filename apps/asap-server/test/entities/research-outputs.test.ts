import { convertBooleanToDecision } from '../../src/entities/research-output';

describe('convertBooleanToDecision', () => {
  test('return Yes when true', () => {
    expect(convertBooleanToDecision(true)).toEqual('Yes');
  });
  test('return No when false', () => {
    expect(convertBooleanToDecision(false)).toEqual('No');
  });
  test('return Not Sure when undefined', () => {
    expect(convertBooleanToDecision(undefined)).toEqual('Not Sure');
  });
});
