import { FileAction } from '@asap-hub/model';
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
    action: FileAction,
    contentType?: string,
  ): Promise<string> {
    const lambdaPayload =
      action === 'upload'
        ? JSON.stringify({ method: 'POST', filename, contentType })
        : JSON.stringify({ method: 'GET', filename });
    const lambdaParams = {
      FunctionName: `asap-hub-${this.stage}-getPresignedUrl`,
      InvocationType: InvocationType.RequestResponse,
      Payload: lambdaPayload,
    };

    const command = new InvokeCommand(lambdaParams);

    const response = await this.lambda.send(command);

    if (!response.Payload) {
      throw new Error('Lambda returned an empty response');
    }

    const payloadText = Buffer.from(response.Payload as Uint8Array).toString(
      'utf8',
    );

    try {
      const parsed = JSON.parse(payloadText);

      if (parsed.statusCode !== 200) {
        throw new Error(`Lambda returned an error: ${JSON.stringify(parsed)}`);
      }

      if (!parsed.payload?.presignedUrl) {
        throw new Error(`Lambda response missing presignedUrl`);
      }

      return parsed.payload.presignedUrl;
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
