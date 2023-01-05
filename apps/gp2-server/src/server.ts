/* istanbul ignore file */

import { getPrettyLogger } from '@asap-hub/server-common';
import { appFactory } from './app';
import { logLevel, logEnabled } from './config';

const port = 4444;
const app = appFactory({ logger: getPrettyLogger({ logLevel, logEnabled }) });

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`GP2 server listening at http://localhost:${port}`);
});
