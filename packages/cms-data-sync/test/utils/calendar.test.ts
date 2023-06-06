import { Environment } from '@asap-hub/contentful';
import { createCalendarLink } from '../../src/utils';
import { calendarEntry } from '../fixtures';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';

describe('createCalendarLink', () => {
  let envMock: Environment;

  const consoleLogRef = console.log;

  beforeEach(async () => {
    console.log = jest.fn();
    jest.clearAllMocks();

    envMock = getContentfulEnvironmentMock();
  });

  afterAll(() => {
    console.log = consoleLogRef;
  });

  it('gets calendar entry and if it exists returns a link', async () => {
    jest.spyOn(envMock, 'getEntry').mockResolvedValueOnce(calendarEntry);

    const link = await createCalendarLink(envMock, 'calendar-1');

    expect(link).toEqual({
      sys: { id: 'calendar-1', linkType: 'Entry', type: 'Link' },
    });
  });

  it("outputs a message when there's an error in the getEntry call", async () => {
    jest
      .spyOn(envMock, 'getEntry')
      .mockRejectedValueOnce(new Error('failed to fetch'));
    const errorText = 'Event with id: event-id';
    const link = await createCalendarLink(envMock, 'calendar-1', errorText);

    expect(console.log).toHaveBeenCalledWith(
      '\x1b[31m',
      `[ERROR] Calendar calendar-1 does not exist in contentful. ${errorText}`,
    );
    expect(link).toEqual(null);
  });
});
