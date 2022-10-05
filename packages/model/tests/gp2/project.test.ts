import {
  isProjectKeyword,
  isProjectMilestoneStatus,
  isProjectStatus,
  projectKeywords,
  projectMilestoneStatus,
  projectStatus,
} from '../../src/gp2';

describe('Project', () => {
  describe('status', () => {
    it.each(projectStatus)('should recognize correct status - %s', (status) => {
      expect(isProjectStatus(status)).toEqual(true);
    });

    it('should not recognize incorrect status', () => {
      expect(isProjectStatus('not-a-status')).toEqual(false);
    });
  });

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

  describe('milestone status', () => {
    it.each(projectMilestoneStatus)(
      'should recognize correct status - %s',
      (status) => {
        expect(isProjectMilestoneStatus(status)).toEqual(true);
      },
    );

    it('should not recognize incorrect status', () => {
      expect(isProjectMilestoneStatus('not-a-status')).toEqual(false);
    });
  });
});
