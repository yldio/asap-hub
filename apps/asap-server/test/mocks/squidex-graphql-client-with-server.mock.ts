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
import { getGraphqlGroup } from '../fixtures/groups.fixtures';
import { getSquidexGraphqlDiscover } from '../fixtures/discover.fixtures';
import { getSquidexGraphqlDashboard } from '../fixtures/dashboard.fixtures';
import { getSquidexGraphqlCalendars } from '../fixtures/calendars.fixtures';

export const getSquidexGraphqlClientMockServer = (): SquidexGraphqlClient => {
  const schema = loadSchemaSync('../../src/schema/schema.graphql', {
    cwd: __dirname,
    loaders: [new GraphQLFileLoader()],
  });
  const resultDto = () => ({
    items: [...new Array(1)],
    total: 1,
  });
  const mocks = {
    Int: () => 8,
    Instant: () => '2021-10-12T15:42:05Z',
    JsonScalar: () => {},
    Groups: () => getGraphqlGroup(),
    GroupsResultDto: resultDto,
    ResearchOutputs: () => getSquidexGraphqlResearchOutput(),
    ResearchOutputsResultDto: resultDto,
    Users: () => getGraphQLUser(),
    UsersResultDto: resultDto,
    Teams: () => getGraphqlTeam(),
    TeamsResultDto: resultDto,
    Discover: () => getSquidexGraphqlDiscover(),
    DiscoveryResultDto: resultDto,
    Dashboard: () => getSquidexGraphqlDashboard(),
    DashboardResultDto: resultDto,
    Calendars: () => getSquidexGraphqlCalendars(),
    CalendarsResultDto: resultDto,
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
      Groups: {
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
