import { SquidexGraphql } from '@asap-hub/squidex';
import { Environment } from 'contentful-management';
import { DocumentNode } from 'graphql';
import { clearContentfulEntries } from './entries';

export const migrateFromSquidexToContentfulFactory =
  async (
    squidexGraphqlClient: SquidexGraphql,
    contentfulEnvironment: Environment,
  ) =>
  async <Record>(
    contentTypeId: string,
    fetchData: (client: SquidexGraphql) => Promise<Record[]>,
    parseData: (data: Record) => Promise<unknown>,
  ) => {
    const data = fetchData(squidexGraphqlClient);

    await clearContentfulEntries(contentfulEnvironment, contentTypeId);


  };
