import { eventStatus, isEventStatus } from '../src/event-common';

describe('Status', () => {
  it.each(eventStatus)(
    'should recognise correct event status - %s',
    (status) => {
      expect(isEventStatus(status)).toEqual(true);
    },
  );

  it('should not recognise incorrect status', () => {
    expect(isEventStatus('not-a-status')).toEqual(false);
  });
});
