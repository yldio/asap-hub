import { IncomingWebhook } from '@slack/webhook';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const url = process.env.SLACK_WEBHOOK!;
const appEnv = process.env.ENVIRONMENT;
const region = process.env.AWS_REGION;

export async function handler() {
  if (!url) {
    return;
  }

  const webhook = new IncomingWebhook(url);

  await webhook.send({
    text:
      `🚨 *GP2-${appEnv}*: API Gateway 5xx errors detected\n` +
      `• Environment: ${appEnv}\n` +
      `• Time: ${new Date().toISOString()}\n` +
      `• [View CloudWatch Alarm](https://console.aws.amazon.com/cloudwatch/home?region=${region}#alarmsV2:alarm/API%20Gateway%205xx%20errors%20detected%20at%20API%20Gateway)\n` +
      `• [View API Gateway](https://console.aws.amazon.com/apigateway/main/apis)`,
  });
}
