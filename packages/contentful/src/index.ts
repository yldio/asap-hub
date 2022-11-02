import * as contentful from 'contentful';
import { CreateClientParams, ContentfulClientApi } from 'contentful';

export const getClient = ({
  space,
  accessToken,
  environment,
  ...rest
}: CreateClientParams) =>
  contentful.createClient({
    space,
    accessToken,
    environment,
    ...rest,
  });

export * from './entities';
export * from './utils';

export { BLOCKS } from '@contentful/rich-text-types';
export type { ContentfulClientApi };
