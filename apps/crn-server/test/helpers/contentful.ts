import {
  createClient,
  RestAdapter,
  MakeRequestOptions,
  Environment,
} from 'contentful-management';
import { RateLimiter } from 'limiter';

import {
  contentfulSpaceId,
  contentfulEnvId,
  contentfulManagementAccessToken,
} from '../../src/config';

export type TestEnvironment = Environment & { teardown: () => Promise<void> };

class ApiAdapter extends RestAdapter {
  rateLimiter = new RateLimiter({
    tokensPerInterval: 3,
    interval: 'second',
  });

  created: string[] = [];

  async makeRequest<R>(options: MakeRequestOptions): Promise<R> {
    this.rateLimiter.removeTokens(1);
    const result = await super.makeRequest<R>(options);
    if (options.action.match(/^create/)) {
      /*
        Handle an issue with the type definitions for `makeRequest` in contentful-management
        The exported types insist `sys` cannot exist on the return value when it patently does
        https://github.com/contentful/contentful-management.js/blob/v10.32.0/lib/contentful-management.ts#L94-L96
      */
      // @ts-ignore
      if (typeof result?.sys?.id === 'string') {
        // @ts-ignore
        this.created.push(result.sys.id);
      }
    }
    return result;
  }
}

export const getEnvironment = async (): Promise<TestEnvironment> => {
  const apiAdapter = new ApiAdapter({
    accessToken: contentfulManagementAccessToken!,
  });
  const client = createClient({
    apiAdapter,
  });
  const space = await client.getSpace(contentfulSpaceId);

  const environment = await space.getEnvironment(contentfulEnvId);

  Object.defineProperty(environment, 'teardown', {
    value: async () => {
      while (apiAdapter.created.length) {
        const id = apiAdapter.created.pop();
        if (id) {
          const toDelete = await environment.getEntry(id);
          if (toDelete.isPublished()) {
            await toDelete.unpublish();
          }
          await toDelete.delete();
        }
      }
    },
  });

  return environment as TestEnvironment;
};
