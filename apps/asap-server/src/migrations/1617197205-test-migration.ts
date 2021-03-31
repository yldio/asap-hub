import { Migration } from '../handlers/webhooks/webhook-run-migrations';

export default class TestMigration implements Migration {
  up = async () => {};

  down = async () => {};
}
