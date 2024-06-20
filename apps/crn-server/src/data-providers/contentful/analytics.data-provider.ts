import {
  FetchAnalyticsTeamLeadershipQuery,
  FetchAnalyticsTeamLeadershipQueryVariables,
  FetchTeamProductivityQuery,
  FetchTeamProductivityQueryVariables,
  FetchUserCollaborationQuery,
  FetchUserCollaborationQueryVariables,
  FetchUserProductivityQuery,
  FetchUserProductivityQueryVariables,
  FETCH_ANALYTICS_TEAM_LEADERSHIP,
  FETCH_TEAM_PRODUCTIVITY,
  FETCH_TEAM_COLLABORATION,
  FETCH_USER_COLLABORATION,
  FETCH_USER_PRODUCTIVITY,
  GraphQLClient,
  FetchTeamCollaborationQuery,
  FetchTeamCollaborationQueryVariables,
} from '@asap-hub/contentful';
import {
  FetchAnalyticsOptions,
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipDataObject,
  ListTeamCollaborationDataObject,
  ListTeamProductivityDataObject,
  ListUserProductivityDataObject,
  TeamProductivityDataObject,
  TeamRole,
  TimeRangeOption,
  UserOutputType,
  UserProductivityDataObject,
  UserProductivityTeam,
} from '@asap-hub/model';
import { cleanArray, parseUserDisplayName } from '@asap-hub/server-common';
import {
  getUserCollaborationItems,
  getTeamCollaborationItems,
} from '../../utils/analytics/collaboration';
import {
  getFilterOutputByRange,
  isTeamOutputDocumentType,
} from '../../utils/analytics/common';
import { getTeamLeadershipItems } from '../../utils/analytics/leadership';
import { AnalyticsDataProvider } from '../types/analytics.data-provider.types';

export class AnalyticsContentfulDataProvider implements AnalyticsDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchTeamLeadership(
    options: FetchPaginationOptions,
  ): Promise<ListAnalyticsTeamLeadershipDataObject> {
    const { take = 10, skip = 0 } = options;
    const { teamsCollection } = await this.contentfulClient.request<
      FetchAnalyticsTeamLeadershipQuery,
      FetchAnalyticsTeamLeadershipQueryVariables
    >(FETCH_ANALYTICS_TEAM_LEADERSHIP, { limit: take, skip });

    return {
      total: teamsCollection?.total || 0,
      items: getTeamLeadershipItems(teamsCollection) || [],
    };
  }

  async fetchUserProductivity(
    options: FetchAnalyticsOptions,
  ): Promise<ListUserProductivityDataObject> {
    const { take = 10, skip = 0, filter: rangeKey } = options;

    const { usersCollection } = await this.contentfulClient.request<
      FetchUserProductivityQuery,
      FetchUserProductivityQueryVariables
    >(FETCH_USER_PRODUCTIVITY, { limit: take, skip });

    return {
      total: usersCollection?.total || 0,
      items: getUserProductivityItems(usersCollection, rangeKey),
    };
  }

  async fetchTeamProductivity(
    options: FetchAnalyticsOptions,
  ): Promise<ListTeamProductivityDataObject> {
    const { take = 10, skip = 0, filter: rangeKey } = options;
    const { teamsCollection } = await this.contentfulClient.request<
      FetchTeamProductivityQuery,
      FetchTeamProductivityQueryVariables
    >(FETCH_TEAM_PRODUCTIVITY, { limit: take, skip });

    return {
      total: teamsCollection?.total || 0,
      items: getTeamProductivityItems(teamsCollection, rangeKey),
    };
  }
  async fetchUserCollaboration(options: FetchAnalyticsOptions) {
    const { take = 10, skip = 0, filter: rangeKey } = options;
    let collection: FetchUserCollaborationQuery['usersCollection'] = {
      total: 0,
      items: [],
    };

    for (let i = 0; i < take / 5; i += 1) {
      const { usersCollection } = await this.contentfulClient.request<
        FetchUserCollaborationQuery,
        FetchUserCollaborationQueryVariables
      >(FETCH_USER_COLLABORATION, { limit: 5, skip: skip + 5 * i });
      if (usersCollection && usersCollection.items) {
        collection = {
          total: usersCollection.total,
          items: [...collection.items, ...usersCollection.items],
        };
      }
    }

    return {
      total: collection?.total || 0,
      items: getUserCollaborationItems(collection, rangeKey),
    };
  }

  async fetchTeamCollaboration(
    options: FetchAnalyticsOptions,
  ): Promise<ListTeamCollaborationDataObject> {
    const { take = 10, skip = 0, filter: rangeKey } = options;

    let collection: FetchTeamCollaborationQuery['teamsCollection'] = {
      total: 0,
      items: [],
    };

    for (let i = 0; i < take / 5; i += 1) {
      const { teamsCollection } = await this.contentfulClient.request<
        FetchTeamCollaborationQuery,
        FetchTeamCollaborationQueryVariables
      >(FETCH_TEAM_COLLABORATION, { limit: 5, skip: skip + 5 * i });
      if (teamsCollection && teamsCollection.items.length) {
        collection = {
          total: teamsCollection.total,
          items: [...collection.items, ...teamsCollection.items],
        };
      } else {
        break;
      }
    }

    return {
      total: collection.total,
      items: getTeamCollaborationItems(collection, rangeKey),
    };
  }
}

const getDocumentTypeKeys = (documentType: string | null | undefined) =>
  documentType && isTeamOutputDocumentType(documentType)
    ? [
        `${documentType} Outputs` as UserOutputType,
        `${documentType} Public Outputs` as UserOutputType,
      ]
    : [];

const getUserProductivityItems = (
  usersCollection: FetchUserProductivityQuery['usersCollection'],
  rangeKey?: TimeRangeOption,
): UserProductivityDataObject[] =>
  cleanArray(usersCollection?.items).map((user) => {
    const teams =
      user.teamsCollection?.items
        .map((teamItem) => {
          if (teamItem?.role && teamItem?.team?.displayName) {
            return {
              team: teamItem.team.displayName,
              id: teamItem.team.sys.id,
              role: teamItem.role as TeamRole,
              isTeamInactive: !!teamItem.team.inactiveSince,
              isUserInactiveOnTeam: !!teamItem.inactiveSinceDate,
            };
          }

          return null;
        })
        .filter(
          (
            userProductivityItem: UserProductivityTeam | null,
          ): userProductivityItem is UserProductivityTeam =>
            userProductivityItem !== null,
        ) || [];

    const userOutputsCount = user.linkedFrom?.researchOutputsCollection?.items
      .filter(getFilterOutputByRange(rangeKey))
      .reduce(
        (outputsCount, outputItem) => {
          const isAuthor = outputItem?.authorsCollection?.items.some(
            (author) =>
              author?.__typename === 'Users' && author.sys.id === user.sys.id,
          );

          const documentTypeKeys = getDocumentTypeKeys(
            outputItem?.documentType,
          );

          if (isAuthor) {
            if (outputItem?.sharingStatus === 'Public') {
              return {
                ...outputsCount,
                outputs: outputsCount.outputs + 1,
                publicOutputs: outputsCount.publicOutputs + 1,
                ...(documentTypeKeys.length > 0 && {
                  [`${documentTypeKeys[0]}`]:
                    outputsCount[`${documentTypeKeys[0] as UserOutputType}`] +
                    1,
                  [`${documentTypeKeys[1]}`]:
                    outputsCount[`${documentTypeKeys[1] as UserOutputType}`] +
                    1,
                }),
              };
            }

            return {
              ...outputsCount,
              outputs: outputsCount.outputs + 1,
              ...(documentTypeKeys.length > 0 && {
                [`${documentTypeKeys[0]}`]:
                  outputsCount[`${documentTypeKeys[0] as UserOutputType}`] + 1,
              }),
            };
          }

          return outputsCount;
        },
        {
          outputs: 0,
          publicOutputs: 0,
          'Article Public Outputs': 0,
          'Article Outputs': 0,
          'Bioinformatics Public Outputs': 0,
          'Bioinformatics Outputs': 0,
          'Dataset Public Outputs': 0,
          'Dataset Outputs': 0,
          'Lab Resource Public Outputs': 0,
          'Lab Resource Outputs': 0,
          'Protocol Public Outputs': 0,
          'Protocol Outputs': 0,
        },
      ) || {
      outputs: 0,
      publicOutputs: 0,
      'Article Public Outputs': 0,
      'Article Outputs': 0,
      'Bioinformatics Public Outputs': 0,
      'Bioinformatics Outputs': 0,
      'Dataset Public Outputs': 0,
      'Dataset Outputs': 0,
      'Lab Resource Public Outputs': 0,
      'Lab Resource Outputs': 0,
      'Protocol Public Outputs': 0,
      'Protocol Outputs': 0,
    };

    return {
      id: user.sys.id,
      name: parseUserDisplayName(
        user.firstName ?? '',
        user.lastName ?? '',
        undefined,
        user.nickname ?? '',
      ),
      isAlumni: !!user.alumniSinceDate,
      teams,
      asapOutput: userOutputsCount.outputs,
      asapPublicOutput: userOutputsCount.publicOutputs,
      ratio:
        userOutputsCount.outputs > 0
          ? (userOutputsCount.publicOutputs / userOutputsCount.outputs).toFixed(
              2,
            )
          : '0.00',
      asapArticleOutput: userOutputsCount['Article Outputs'],
      asapArticlePublicOutput: userOutputsCount['Article Public Outputs'],
      articleRatio:
        userOutputsCount['Article Outputs'] > 0
          ? (
              userOutputsCount['Article Public Outputs'] /
              userOutputsCount['Article Outputs']
            ).toFixed(2)
          : '0.00',
      asapBioinformaticsOutput: userOutputsCount['Bioinformatics Outputs'],
      asapBioinformaticsPublicOutput:
        userOutputsCount['Bioinformatics Public Outputs'],
      bioinformaticsRatio:
        userOutputsCount['Bioinformatics Outputs'] > 0
          ? (
              userOutputsCount['Bioinformatics Public Outputs'] /
              userOutputsCount['Bioinformatics Outputs']
            ).toFixed(2)
          : '0.00',
      asapDatasetOutput: userOutputsCount['Dataset Outputs'],
      asapDatasetPublicOutput: userOutputsCount['Dataset Public Outputs'],
      datasetRatio:
        userOutputsCount['Dataset Outputs'] > 0
          ? (
              userOutputsCount['Dataset Public Outputs'] /
              userOutputsCount['Dataset Outputs']
            ).toFixed(2)
          : '0.00',
      asapLabResourceOutput: userOutputsCount['Lab Resource Outputs'],
      asapLabResourcePublicOutput:
        userOutputsCount['Lab Resource Public Outputs'],
      labResourceRatio:
        userOutputsCount['Lab Resource Outputs'] > 0
          ? (
              userOutputsCount['Lab Resource Public Outputs'] /
              userOutputsCount['Lab Resource Outputs']
            ).toFixed(2)
          : '0.00',
      asapProtocolOutput: userOutputsCount['Protocol Outputs'],
      asapProtocolPublicOutput: userOutputsCount['Protocol Public Outputs'],
      protocolRatio:
        userOutputsCount['Protocol Outputs'] > 0
          ? (
              userOutputsCount['Protocol Public Outputs'] /
              userOutputsCount['Protocol Outputs']
            ).toFixed(2)
          : '0.00',
    };
  });

const getTeamProductivityItems = (
  teamsCollection: FetchTeamProductivityQuery['teamsCollection'],
  rangeKey?: TimeRangeOption,
): TeamProductivityDataObject[] =>
  cleanArray(teamsCollection?.items).map((teamItem) => {
    const initialDocumentTypesCount = {
      Article: 0,
      Bioinformatics: 0,
      Dataset: 0,
      'Lab Resource': 0,
      Protocol: 0,
    };

    const documentTypesCount =
      teamItem.linkedFrom?.researchOutputsCollection?.items
        .filter(getFilterOutputByRange(rangeKey))
        .reduce((count, researchOutput) => {
          if (
            researchOutput?.documentType &&
            isTeamOutputDocumentType(researchOutput.documentType)
          ) {
            return {
              ...count,
              [researchOutput.documentType]:
                count[researchOutput.documentType] + 1,
            };
          }
          return count;
        }, initialDocumentTypesCount) || initialDocumentTypesCount;

    return {
      id: teamItem.sys.id,
      name: teamItem.displayName || '',
      isInactive: !!teamItem.inactiveSince,
      Article: documentTypesCount.Article,
      Bioinformatics: documentTypesCount.Bioinformatics,
      Dataset: documentTypesCount.Dataset,
      'Lab Resource': documentTypesCount['Lab Resource'],
      Protocol: documentTypesCount.Protocol,
    };
  });
