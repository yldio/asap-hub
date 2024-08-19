/* istanbul ignore file */

import { getPrettyLogger } from '@asap-hub/server-common';
import express from 'express';
import { appFactory } from './app';
import { logLevel, logEnabled } from './config';
import { publicAppFactory } from './publicApp';

const port = 3333;
const app = express();
const api = appFactory({ logger: getPrettyLogger({ logLevel, logEnabled }) });
const publicApi = publicAppFactory({
  logger: getPrettyLogger({ logLevel, logEnabled }),
});

app.use([publicApi, api]).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`ASAP server listening at http://localhost:${port}`);
});
