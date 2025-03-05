import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import { region, environment } from '../config';

export default class FileProvider {
  private lambda: LambdaClient;
  private stage: string;

  constructor() {
    this.lambda = new LambdaClient({ region });
    this.stage = environment === 'development' ? 'dev' : environment || 'dev';
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

    const payload = JSON.parse(response.Payload.toString());

    if (payload.statusCode !== 200) {
      throw new Error(`Lambda returned an error: ${JSON.stringify(payload)}`);
    }

    return JSON.parse(payload.body).uploadUrl;
  }
}
