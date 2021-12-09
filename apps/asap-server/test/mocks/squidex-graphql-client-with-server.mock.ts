import {
  ASTNode,
  DocumentNode,
  ExecutionResult,
  graphql,
  print,
} from 'graphql';
import { addMocksToSchema, createMockStore } from '@graphql-tools/mock';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { SquidexGraphqlClient } from '@asap-hub/squidex';
import { getSquidexGraphqlResearchOutput } from '../fixtures/research-output.fixtures';
import { getGraphQLUser } from '../fixtures/users.fixtures';
import { getGraphqlTeam } from '../fixtures/teams.fixtures';

export const getSquidexGraphqlClientMockServer = (): SquidexGraphqlClient => {
  const schema = loadSchemaSync('../../src/schema/schema.graphql', {
    cwd: __dirname,
    loaders: [new GraphQLFileLoader()],
  });
  const mocks = {
    Int: () => 8,
    Instant: () => '2021-10-12T15:42:05Z',
    JsonScalar: () => {},
    ResearchOutputs: () => getSquidexGraphqlResearchOutput(),
    ResearchOutputsResultDto: () => ({
      items: [...new Array(1)],
      total: 1,
    }),
    Users: () => getGraphQLUser(),
    UsersResultDto: () => ({
      items: [...new Array(1)],
      total: 1,
    }),
    Teams: () => getGraphqlTeam(),
    TeamsResultDto: () => ({
      items: [...new Array(1)],
      total: 1,
    }),
  };
  const store = createMockStore({
    schema,
    mocks,
    typePolicies: {
      UsersDataTeamsChildDto: {
        keyFieldName: false,
      },
      Teams: {
        keyFieldName: false,
      },
    },
  });
  const schemaWithMocks = addMocksToSchema({
    schema,
    store,
  });

  return {
    request: async <T extends { [key: string]: any }, V>(
      query: string | DocumentNode,
      variables?: V,
    ): Promise<T> => {
      const result = (await graphql(
        schemaWithMocks,
        print(query as ASTNode),
        undefined,
        undefined,
        variables,
      )) as ExecutionResult<T>;

      if (Array.isArray(result.errors) && result.errors.length > 0) {
        throw new Error(JSON.stringify(result.errors));
      }

      return result.data as T;
    },
  };
};
