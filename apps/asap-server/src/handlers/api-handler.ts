import serverlessHttp from 'serverless-http';
import { appFactory } from '../app';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const app = appFactory();

export const apiHandler = serverlessHttp(app, {
  request(request: any, event: APIGatewayProxyEventV2) {
    request.context = event.requestContext;
  },
});

declare global {
  namespace Express {
    interface Request {
      context: APIGatewayProxyEventV2['requestContext'];
    }
  }
}
