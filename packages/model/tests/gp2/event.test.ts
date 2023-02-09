import { eventStatus, isEventStatus } from '../../src/gp2';

describe('Status', () => {
  it.each(eventStatus)(
    'should recognize correct event status - %s',
    (status) => {
      expect(isEventStatus(status)).toEqual(true);
    },
  );

  it('should not recognize incorrect status', () => {
    expect(isEventStatus('not-a-status')).toEqual(false);
  });
});
