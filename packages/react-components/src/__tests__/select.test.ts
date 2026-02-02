import { getMultiValueStyles } from '../select';

describe('getMultiValueStyles', () => {
  it('returns styles when multiValue is a function', () => {
    const expectedStyles = { padding: '5px', margin: '10px' };
    const selectStyles = {
      multiValue: () => expectedStyles,
    };

    expect(getMultiValueStyles(selectStyles)).toEqual(expectedStyles);
  });

  it('returns empty object when selectStyles is undefined', () => {
    expect(getMultiValueStyles(undefined)).toEqual({});
  });

  it('returns empty object when multiValue is not defined', () => {
    expect(getMultiValueStyles({})).toEqual({});
  });

  it('returns empty object when multiValue is not a function', () => {
    const selectStyles = {
      multiValue: { padding: '5px' },
    };

    expect(getMultiValueStyles(selectStyles)).toEqual({});
  });
});
