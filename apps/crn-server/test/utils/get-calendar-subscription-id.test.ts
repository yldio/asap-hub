describe('getCalendarSubscriptionId', () => {
  test('Should return provided id prefixed with contentful__{env}__', async () => {
    process.env.CONTENTFUL_ENV_ID = 'test-env';

    const { getCalendarSubscriptionId } = await import(
      '../../src/utils/get-calendar-subscription-id'
    );
    expect(getCalendarSubscriptionId('123')).toEqual(
      `contentful__test-env__123`,
    );
  });
});

export {};
