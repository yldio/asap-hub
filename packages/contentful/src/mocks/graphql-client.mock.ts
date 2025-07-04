/* istanbul ignore file */
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addMocksToSchema, createMockStore, IMocks } from '@graphql-tools/mock';
import { ASTNode, graphql, print } from 'graphql';
import { GraphQLClient } from 'graphql-request';

const resultDto = () => ({
  items: [...new Array(1)],
  total: 1,
});

const getGraphqlClientMockServer = (
  schemaLocation: string,
  baseMocks: IMocks,
  inputMocks: IMocks,
) => {
  const schema = loadSchemaSync(schemaLocation, {
    cwd: __dirname,
    loaders: [new GraphQLFileLoader()],
  });
  const mocks = {
    JSON: () => '2021-10-12T15:42:05Z',
    DateTime: () => null,
    ...baseMocks,
    ...inputMocks,
  };
  const store = createMockStore({
    schema,
    mocks,
  });
  const schemaWithMocks = addMocksToSchema({
    schema,
    store,
  });

  return {
    request: async (query, variables?) => {
      const result = await graphql(
        schemaWithMocks,
        print(query as ASTNode),
        undefined,
        undefined,
        variables as { [key: string]: unknown },
      );

      if (Array.isArray(result.errors) && result.errors.length > 0) {
        throw new Error(JSON.stringify(result.errors));
      }

      return result.data;
    },
  } as GraphQLClient;
};

export const getContentfulGraphqlClientMockServer = (
  inputMocks: IMocks,
): GraphQLClient => {
  const schemaLocation = '../crn/schema/autogenerated-schema.graphql';
  const baseMocks = {
    AnnouncementCollection: resultDto,
    CategoryCollection: resultDto,
    CalendarsCollection: resultDto,
    DashboardAnnouncementsCollection: resultDto,
    DashboardNewsCollection: resultDto,
    DashboardPagesCollection: resultDto,
    EventsCollection: resultDto,
    ExternalAuthorsCollection: resultDto,
    InterestGroupsCollection: resultDto,
    ImpactCollection: resultDto,
    InterestGroupLeadersCollection: resultDto,
    LabsCollection: resultDto,
    ManuscriptsCollection: resultDto,
    ManuscriptsVersionsCollection: resultDto,
    NewsCollection: resultDto,
    PagesCollection: resultDto,
    ResearchOutputsCollection: resultDto,
    TeamsCollection: resultDto,
    TutorialsCollection: resultDto,
    TeamMembershipCollection: resultDto,
    UsersCollection: resultDto,
    WorkingGroupsCollection: resultDto,
    WorkingGroupLeadersCollection: resultDto,
    WorkingGroupMembersCollection: resultDto,
  };
  return getGraphqlClientMockServer(schemaLocation, baseMocks, inputMocks);
};

export const getGP2ContentfulGraphqlClientMockServer = (
  inputMocks: IMocks,
): GraphQLClient => {
  const schemaLocation = '../gp2/schema/autogenerated-schema.graphql';
  const baseMocks = {
    AnnouncementCollection: resultDto,
    CalendarsCollection: resultDto,
    ContributingCohortsCollection: resultDto,
    DashboardCollection: resultDto,
    EventsCollection: resultDto,
    ExternalUsersCollection: resultDto,
    GuidesCollection: resultDto,
    GuideDescriptionCollection: resultDto,
    TagsCollection: resultDto,
    LinkedFrom: resultDto,
    MembersCollection: resultDto,
    MilestonesCollection: resultDto,
    NewsCollection: resultDto,
    OutputsCollection: resultDto,
    PagesCollection: resultDto,
    ProjectMembershipCollection: resultDto,
    ProjectNetworkCollection: resultDto,
    ProjectsCollection: resultDto,
    ProjectsMilestonesCollection: resultDto,
    ProjectsResourcesCollection: resultDto,
    ProjectsWorkingGroupsMembersCollection: resultDto,
    UsersCollection: resultDto,
    WorkingGroupMembershipCollection: resultDto,
    WorkingGroupNetworkCollection: resultDto,
    WorkingGroupsCollection: resultDto,
    WorkingGroupsMembersCollection: resultDto,
    WorkingGroupsMilestonesCollection: resultDto,
    WorkingGroupsResourcesCollection: resultDto,
    WorkingGroupsTagsCollection: resultDto,
  };
  return getGraphqlClientMockServer(schemaLocation, baseMocks, inputMocks);
};
