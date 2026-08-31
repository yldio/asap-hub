/* istanbul ignore file */
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Request as RequestExpress } from 'express';
import serverlessHttp from 'serverless-http';
import { appFactory } from '../app';

const app = appFactory();

interface RequestWithContext extends RequestExpress {
  context: APIGatewayProxyEventV2['requestContext'];
}

const TEXT_CONTENT_TYPE =
  /^(?:text\/|application\/(?:json|x-ndjson|javascript|xml|vnd\.apple\.mpegurl)$)/;

// serverless-http utf8 decodes whatever it is not told is binary, which would
// replace every non-utf8 byte the local /media route streams
const isBinaryResponse = (headers: Record<string, string>): boolean => {
  const [mediaType = ''] = (headers['content-type'] ?? '').split(';');
  const contentType = mediaType.trim().toLowerCase();
  return contentType !== '' && !TEXT_CONTENT_TYPE.test(contentType);
};

export const apiHandler = serverlessHttp(app, {
  binary: isBinaryResponse,
  request(request: RequestWithContext, event: APIGatewayProxyEventV2) {
    request.context = event.requestContext;
  },
});
