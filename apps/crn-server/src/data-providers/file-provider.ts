import * as AWS from "@aws-sdk/client-lambda";
import { region } from '../config';

export default class FileProvider {
  private lambda: AWS.Lambda;

  constructor() {
    this.lambda = new AWS.Lambda({ region });
  }

  async getPresignedUrl(
    filename: string,
    contentType: string,
  ): Promise<string> {
    const lambdaParams = {
      FunctionName: 'getPresignedUrl',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ filename, contentType }),
    };

    const response = await this.lambda.invoke(lambdaParams).promise();
    const payload = JSON.parse(response.Payload as string);

    if (payload.statusCode !== 200) {
      throw new Error(`Lambda returned an error: ${JSON.stringify(payload)}`);
    }

    return JSON.parse(payload.body).uploadUrl;
  }
}
