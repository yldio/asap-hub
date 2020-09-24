import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import ResearchOutputs from '../../controllers/research-outputs';
import { Handler } from '../../utils/types';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const researchOutputs = new ResearchOutputs();
    const outputs = await researchOutputs.fetch();

    return {
      statusCode: 200,
      payload: outputs,
    };
  },
);
