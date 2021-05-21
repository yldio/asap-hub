import { render } from '@testing-library/react';

import GoogleCalendar from '../GoogleCalendar';
import { getLocalTimezone } from '../../localization';

jest.mock('../../localization');
const mockGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;

it('renders an iframe', () => {
  const { getByTitle } = render(<GoogleCalendar calendars={[]} />);
  expect(getByTitle(/calendar/i).tagName).toBe('IFRAME');
});

it('uses the local timezone', () => {
  mockGetLocalTimezone.mockReturnValue('Europe/Tallinn');
  const { getByTitle } = render(<GoogleCalendar calendars={[]} />);

  const iframeUrl = new URL((getByTitle(/calendar/i) as HTMLIFrameElement).src);
  expect(iframeUrl.searchParams.get('ctz')).toBe('Europe/Tallinn');
});

it('appends a src-color tuple per calendar', () => {
  const { getByTitle } = render(
    <GoogleCalendar
      calendars={[
        { id: '42', color: '#060D5E' },
        { id: '1337', color: '#BE6D00' },
      ]}
    />,
  );

  const iframeUrl = new URL((getByTitle(/calendar/i) as HTMLIFrameElement).src);
  expect(iframeUrl.searchParams.getAll('src')).toEqual(['42', '1337']);
  expect(iframeUrl.searchParams.getAll('color')).toEqual([
    '#060D5E',
    '#BE6D00',
  ]);
});
