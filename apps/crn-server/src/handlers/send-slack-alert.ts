import { IncomingWebhook } from '@slack/webhook';

const url = process.env.SLACK_WEBHOOK!;
const appEnv = process.env.ENVIRONMENT;

export async function handler() {
  if (!url) {
    return;
  }

  const webhook = new IncomingWebhook(url);

  await webhook.send({
    text: `CRN-${appEnv}: 5xx errors detected at API Gateway`,
  });
}
