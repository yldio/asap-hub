import { isProjectType, projectTypes } from '../src/project';

describe('Project Model', () => {
  describe('isProjectType', () => {
    it.each(projectTypes)(
      'should return true for valid project type "%s"',
      (projectType) => {
        expect(isProjectType(projectType)).toBe(true);
      },
    );

    it('should return false for invalid string', () => {
      expect(isProjectType('Invalid Project')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isProjectType(undefined)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isProjectType(null)).toBe(false);
    });

    it('should return false for number', () => {
      expect(isProjectType(123)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isProjectType('')).toBe(false);
    });
  });
});
