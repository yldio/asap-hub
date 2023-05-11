describe('Subscribe handler', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should select right handler and path when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

    const {
      path,
      calendarCreatedHandlerFactory,
    } = require('../../../src/handlers/calendar/subscribe-handler');
    const {
      calendarCreatedHandlerFactory: calendarCreatedSquidexHandlerFactory,
      calendarCreatedContentfulHandlerFactory,
    } = require('@asap-hub/server-common');

    expect(calendarCreatedHandlerFactory).toEqual(
      calendarCreatedSquidexHandlerFactory,
    );
    expect(calendarCreatedHandlerFactory).not.toEqual(
      calendarCreatedContentfulHandlerFactory,
    );
    expect(path).toBeUndefined();
  });

  it('Should select right handler and path when the Contentful feature flag is on', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';

    const {
      contentfulDeliveryApiConfig,
      path,
      calendarCreatedHandlerFactory,
    } = require('../../../src/handlers/calendar/subscribe-handler');
    const {
      calendarCreatedHandlerFactory: calendarCreatedSquidexHandlerFactory,
      calendarCreatedContentfulHandlerFactory,
    } = require('@asap-hub/server-common');

    expect(calendarCreatedHandlerFactory).toEqual(
      calendarCreatedContentfulHandlerFactory,
    );
    expect(calendarCreatedHandlerFactory).not.toEqual(
      calendarCreatedSquidexHandlerFactory,
    );
    expect(contentfulDeliveryApiConfig).toEqual({
      accessToken: expect.any(String),
      environment: expect.any(String),
      space: expect.any(String),
    });
    expect(path).toEqual('contentful');
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
