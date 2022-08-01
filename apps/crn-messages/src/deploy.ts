import { syncTemplates } from '@asap-hub/messages-common';
import config from './webpack.config';

syncTemplates(config).catch((err) => {
  console.error(err);
  process.exit(1);
});
