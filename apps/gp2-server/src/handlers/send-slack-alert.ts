import { IncomingWebhook } from '@slack/webhook';
import logger from '../utils/logger';

export async function handler() {
  const url = process.env.SLACK_WEBHOOK;
  const appEnv = process.env.ENVIRONMENT;
  const region = process.env.AWS_REGION;

  if (!url) {
    logger.warn('SLACK_WEBHOOK not configured, skipping alert');
    return;
  }

  // Validate that the webhook URL is a proper URL, not localhost
  if (!url.startsWith('https://hooks.slack.com/')) {
    throw new Error(
      `Invalid SLACK_WEBHOOK configuration: URL must start with 'https://hooks.slack.com/' - current value: ${url}`,
    );
  }

  const webhook = new IncomingWebhook(url);

  try {
    await webhook.send({
      text: `🚨 *GP2-${appEnv}*: API Gateway 5xx errors detected\n• Environment: ${appEnv}\n• Time: ${new Date().toISOString()}\n• [View CloudWatch Alarm](https://console.aws.amazon.com/cloudwatch/home?region=${region}#alarmsV2:alarm/API%20Gateway%205xx%20errors%20detected%20at%20API%20Gateway)\n• [View API Gateway](https://console.aws.amazon.com/apigateway/main/apis)`,
    });
  } catch (error) {
    logger.warn('Failed to send Slack alert:', error);
    throw error;
  }
}
