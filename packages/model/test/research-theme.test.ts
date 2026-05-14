import { isResearchThemeType, researchThemeTypes } from '../src/research-theme';

describe('Research Theme Model', () => {
  describe('isResearchThemeType', () => {
    it.each(researchThemeTypes)('recognises %s as a valid type', (value) => {
      expect(isResearchThemeType(value)).toBe(true);
    });

    it('rejects unknown string values', () => {
      expect(isResearchThemeType('not-a-type')).toBe(false);
    });

    it('rejects non-string values', () => {
      expect(isResearchThemeType(undefined)).toBe(false);
      expect(isResearchThemeType(null)).toBe(false);
      expect(isResearchThemeType(42)).toBe(false);
      expect(isResearchThemeType({})).toBe(false);
    });
  });
});
