/* istanbul ignore file */

import { appFactory } from './app';

const port = 3333;
const app = appFactory();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`ASAP server listening at http://localhost:${port}`);
});
