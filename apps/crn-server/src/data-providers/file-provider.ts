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
    action: 'download' | 'upload',
    contentType?: string,
  ): Promise<string> {
    const lambdaPayload = {
      headers: {
        'content-type': 'application/json',
      },
      requestContext: {
        http: {
          method: 'POST',
          path: '/files/get-url',
        },
      },
      pathParameters: {},
      queryStringParameters: {},
      body: JSON.stringify({ action, filename, contentType }),
      isBase64Encoded: false,
    };

    const lambdaParams = {
      FunctionName: `asap-hub-${this.stage}-getPresignedUrl`,
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify(lambdaPayload),
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

      if (!parsedBody.presignedUrl) {
        throw new Error(`Lambda response missing presignedUrl`);
      }

      return parsedBody.presignedUrl;
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
