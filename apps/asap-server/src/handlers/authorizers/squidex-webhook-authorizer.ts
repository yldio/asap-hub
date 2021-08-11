import { APIGatewayAuthorizerEvent } from 'aws-lambda';

export const handler = async (
  event: APIGatewayAuthorizerEvent,
): Promise<Policy> => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(event));

  return generatePolicy('Allow', event.methodArn);
};

const generatePolicy = (
  effect: 'Allow' | 'Deny',
  methodArn: string,
): Policy => ({
  principalId: 'user',
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: methodArn,
    },
  ],
});

type Policy = {
  principalId: string;
  Version: '2012-10-17';
  Statement: {
    Action: string;
    Effect: 'Deny' | 'Allow';
    Resource: string;
  }[];
};
