import Events from '../src/controllers/event.controller';
import { getContentfulGraphQLClientFactory } from '../src/dependencies/clients.dependency';

import {
  getJWTCredentialsFactory,
  syncCalendarFactory,
  syncEventFactory,
} from '@asap-hub/server-common';
import { googleApiCredentialsSecretId, region } from '../src/config';
import { getEventDataProvider } from '../src/dependencies/event.dependency';
import logger from '../src/utils/logger';
const graphQLClient = getContentfulGraphQLClientFactory();

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});
const eventController = new Events(getEventDataProvider(graphQLClient));
const main = async () => {
  const syncCalendar = syncCalendarFactory(
    syncEventFactory(eventController, logger),
    getJWTCredentials,
    logger,
  );
  await syncCalendar(
    'c_c25d607083a313d0346f4df3ce322d0fd9bc39f41370b3c21bf08fb206f6637f@group.calendar.google.com',
    '5bVGLZpEzQHQ0mPVeBe86x',
    'CMCa0o60tIIDEMCa0o60tIIDGAEgnZOKlAI=',
  );
  console.log('done');
};

main().catch(console.error);
