import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import { region, environment } from '../config';
import logger from '../utils/logger';

export default class FileProvider {
  private lambda: LambdaClient;
  private stage: string;

  constructor() {
    this.lambda = new LambdaClient({ region });
    this.stage = environment === 'development' ? 'dev' : environment;
  }

  isASCII(str: string) {
    return /^[\u0020-\u007E]*$/.test(str); // Matches printable ASCII characters (space to ~)
  }

  async getPresignedUrl(
    filename: string,
    contentType: string,
  ): Promise<string> {
    const lambdaParams = {
      FunctionName: `asap-hub-${this.stage}-getPresignedUrl`,
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify({ filename, contentType }),
    };

    const command = new InvokeCommand(lambdaParams);

    const response = await this.lambda.send(command);

    if (!response.Payload) {
      throw new Error('Lambda returned an empty response');
    }

    const payloadText = response.Payload.toString().trim();

    try {
      const payload = JSON.parse(payloadText);

      if (payload.statusCode !== 200) {
        throw new Error(`Lambda returned an error: ${JSON.stringify(payload)}`);
      }

      if (!payload.body) {
        throw new Error(`Lambda response missing body`);
      }

      const parsedBody =
        typeof payload.body === 'string'
          ? JSON.parse(payload.body)
          : payload.body;

      if (!parsedBody.uploadUrl) {
        throw new Error(`Lambda response missing uploadUrl`);
      }

      return parsedBody.uploadUrl;
    } catch (parseError) {
      logger.error('Error parsing Lambda response', {
        rawPayload: payloadText,
        errorMessage: (parseError as Error).message,
      });
      throw new Error(
        `Invalid JSON response from Lambda: ${
          this.isASCII(payloadText)
            ? String.fromCharCode(...payloadText.split(',').map(Number))
            : payloadText
        }`,
      );
    }
  }
}
