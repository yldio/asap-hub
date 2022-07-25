/* istanbul ignore file */

import { appFactory } from './app';

const port = 4444;
const app = appFactory();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`GP2 server listening at http://localhost:${port}`);
});
