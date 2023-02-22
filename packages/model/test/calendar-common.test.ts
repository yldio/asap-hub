import {
  googleLegacyCalendarColor,
  isGoogleLegacyCalendarColor,
} from '../src/calendar-common';

describe('isGoogleLegacyCalendarColor', () => {
  it.each(googleLegacyCalendarColor)(
    'should recognise correct calendar colour - %s',
    (colour) => {
      expect(isGoogleLegacyCalendarColor(colour)).toEqual(true);
    },
  );

  it('should not recognise incorrect colour', () => {
    expect(isGoogleLegacyCalendarColor('not-a-colour')).toEqual(false);
  });
});
