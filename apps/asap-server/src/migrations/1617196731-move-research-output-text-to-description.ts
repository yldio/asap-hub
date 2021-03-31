import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import logger from '../utils/logger';

export default class MoveResearchOutputTextToDescription implements Migration {
  up = async () => {
    logger.debug('up');
  };

  down = async () => {};
}
