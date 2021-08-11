import { APIGatewayAuthorizerEvent } from 'aws-lambda';

export const handler = (
  event: APIGatewayAuthorizerEvent,
): SimpleAuthorizerResponse => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(event));

  return {
    isAuthorized: true,
    context: {},
  };
};

type SimpleAuthorizerResponse = {
  isAuthorized: boolean;
  context: {
    [key: string]: string;
  };
};
