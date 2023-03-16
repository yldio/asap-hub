import { getEventListOptions } from '..';

describe('getEventListOptions', () => {
  it('sets after for upcoming events', () => {
    expect(
      getEventListOptions(new Date('2021-01-01T05:00:00'), { past: false })
        .after,
    ).toMatchInlineSnapshot(`"2021-01-01T04:00:00.000Z"`);
  });

  it('sets before for past events', () => {
    expect(
      getEventListOptions(new Date('2021-01-01T05:00:00'), { past: true })
        .before,
    ).toMatchInlineSnapshot(`"2021-01-01T04:00:00.000Z"`);
  });

  it('passes through other options', () => {
    expect(
      getEventListOptions(new Date(), {
        past: false,
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
