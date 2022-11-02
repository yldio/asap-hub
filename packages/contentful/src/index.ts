import * as contentful from 'contentful';
import { CreateClientParams, ContentfulClientApi } from 'contentful';

export const getClient = ({
  space,
  accessToken,
  environment,
}: CreateClientParams) =>
  contentful.createClient({
    space,
    accessToken,
    environment,
  });

export * from './entities';
export * from './utils';

export { BLOCKS } from '@contentful/rich-text-types';
export type { ContentfulClientApi };
