import {
  isProjectKeyword,
  isProjectMemberRole,
  projectKeywords,
  projectMemberRole,
} from '../../src/gp2';

describe('Project', () => {
  describe('Keywords', () => {
    it.each(projectKeywords)(
      'should recognize correct keyword - %s',
      (keyword) => {
        expect(isProjectKeyword(keyword)).toEqual(true);
      },
    );

    it('should not recognize incorrect keyword', () => {
      expect(isProjectKeyword('not-a-keyword')).toEqual(false);
    });
  });
  describe('ProjectMemberRole', () => {
    it.each(projectMemberRole)('should recognise correct role - %s', (role) => {
      expect(isProjectMemberRole(role)).toEqual(true);
    });

    it('should not recognise incorrect role', () => {
      expect(isProjectMemberRole('not-a-role')).toEqual(false);
    });
  });
});
