import { isEventStatus, eventStatus } from '../src';

describe('Status', () => {
  it.each(eventStatus)(
    'should recognize correct event status - %s',
    (status) => {
      expect(isEventStatus(status)).toEqual(true);
    },
  );

  it('should not recognize incorrect role', () => {
    expect(isEventStatus('not-a-status')).toEqual(false);
  });
});
