import {
  isProjectMemberRole,
  isProjectStatus,
  projectMemberRole,
  projectStatus,
} from '../../src/gp2';

describe('project', () => {
  describe('isProjectStatus', () => {
    it.each(projectStatus)('should recognise correct value %s', (value) => {
      expect(isProjectStatus(value)).toEqual(true);
    });

    it('should not recognise incorrect value', () => {
      expect(isProjectStatus('not-valid')).toEqual(false);
    });
  });
  describe('isProjectMemberRole', () => {
    it.each(projectMemberRole)('should recognise correct value %s', (value) => {
      expect(isProjectMemberRole(value)).toEqual(true);
    });

    it('should not recognise incorrect value', () => {
      expect(isProjectMemberRole('not-valid')).toEqual(false);
    });
  });
});
