import { getEventListOptions } from '../options';

describe('getEventListOptions', () => {
  it('sets after for upcoming events', () => {
    expect(
      getEventListOptions(new Date('2021-01-01T05:00:00'), false).after,
    ).toMatchInlineSnapshot(`"2021-01-01T04:00:00.000Z"`);
  });
  it('does not set sort for upcoming events', () => {
    expect(getEventListOptions(new Date(), false).sort).toBe(undefined);
  });

  it('sets before for past events', () => {
    expect(
      getEventListOptions(new Date('2021-01-01T05:00:00'), true).before,
    ).toMatchInlineSnapshot(`"2021-01-01T04:00:00.000Z"`);
  });
  it('sets sort for past events', () => {
    expect(
      getEventListOptions(new Date('2021-01-01T05:00:00'), true).sort,
    ).toEqual({ sortBy: 'endDate', sortOrder: 'desc' });
  });

  it('passes through other options', () => {
    expect(
      getEventListOptions(new Date(), false, {
        pageSize: 5,
        currentPage: 3,
        searchQuery: 'q',
      }),
    ).toMatchObject({
      pageSize: 5,
      currentPage: 3,
      searchQuery: 'q',
    });
  });
});
