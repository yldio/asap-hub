import {
  DocumentCategoryOption,
  TeamCollaborationDataObject,
  TeamCollaborationPerformance,
  UserCollaborationDataObject,
  UserCollaborationPerformance,
} from '@asap-hub/model';
import { utils } from '@asap-hub/react-components';

const getOutputPrefix = (documentCategory: DocumentCategoryOption) => {
  switch (documentCategory) {
    case 'article':
      return 'Article Outputs';
    case 'bioinformatics':
      return 'Bioinformatic Outputs';
    case 'dataset':
      return 'Dataset Outputs';
    case 'lab-resource':
      return 'Lab Resource Outputs';
    case 'protocol':
      return 'Protocol Outputs';
    case 'all':
    default:
      return 'Outputs';
  }
};

export const userCollaborationToCSV =
  (
    type: 'within-team' | 'across-teams',
    performance: UserCollaborationPerformance,
    documentCategory: DocumentCategoryOption,
  ) =>
  (data: UserCollaborationDataObject) => ({
    User: data.name,
    'User Status': data.alumniSince ? 'Alumni' : 'Active',
    'Alumni Since': data.alumniSince ?? '',
    // Always iterate through 3 teams even if user does not have 3
    // This is because if the first in the row does not have 3 teams
    // the columns are not created
    ...[...new Array(3)].reduce((result, _, index) => {
      const teamSuffix = index === 0 ? 'A' : index === 1 ? 'B' : 'C';

      const outputPrefix = getOutputPrefix(documentCategory);

      if (!data.teams[index]?.team) {
        return {
          ...result,
          [`Team ${teamSuffix}`]: '',
          [`Team Status ${teamSuffix}`]: '',
          [`Team Inactive Since ${teamSuffix}`]: '',
          [`Role ${teamSuffix}`]: '',
          [`User Team Status ${teamSuffix}`]: '',
          [`User Team Inactive Since ${teamSuffix}`]: '',
          [`${outputPrefix} Co-Authored: Value ${teamSuffix}`]: '',
          [`${outputPrefix} Co-Authored: Average ${teamSuffix}`]: '',
        };
      }

      const {
        team,
        teamInactiveSince,
        teamMembershipInactiveSince,
        role,
        outputsCoAuthoredAcrossTeams,
        outputsCoAuthoredWithinTeam,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      } = data.teams[index]!;

      const value =
        type === 'within-team'
          ? outputsCoAuthoredWithinTeam
          : outputsCoAuthoredAcrossTeams;

      const performanceValue =
        type === 'within-team'
          ? performance.withinTeam
          : performance.acrossTeam;

      return {
        ...result,
        [`Team ${teamSuffix}`]: team || '',
        [`Team Status ${teamSuffix}`]: teamInactiveSince
          ? 'Inactive'
          : 'Active',
        [`Team Inactive Since ${teamSuffix}`]: teamInactiveSince || '',
        [`Role ${teamSuffix}`]: role || '',
        [`User Team Status ${teamSuffix}`]: teamInactiveSince
          ? 'Inactive'
          : teamMembershipInactiveSince
            ? 'Inactive'
            : 'Active',
        [`User Team Inactive Since ${teamSuffix}`]:
          teamMembershipInactiveSince || '',
        [`${outputPrefix} Co-Authored: Value ${teamSuffix}`]: value,
        [`${outputPrefix} Co-Authored: Average ${teamSuffix}`]:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          utils.getPerformanceText(value!, performanceValue),
      };
    }, {}),
  });

export const teamCollaborationWithinTeamToCSV =
  (performance: TeamCollaborationPerformance, outputType: 'all' | 'public') =>
  (data: TeamCollaborationDataObject) => {
    const dataByDocumentType = data.outputsCoProducedWithin;
    const performanceByDocumentType = performance.withinTeam;

    const fieldPreffix = outputType === 'all' ? 'ASAP' : 'ASAP Public';
    return {
      Team: data.name,
      'Team Status': data.inactiveSince ? 'Inactive' : 'Active',
      'Inactive Since': data.inactiveSince || '',
      [`${fieldPreffix} Article Output: Value`]: dataByDocumentType.Article,
      [`${fieldPreffix} Article Output: Average`]: utils.getPerformanceText(
        dataByDocumentType.Article,
        performanceByDocumentType.article,
      ),
      [`${fieldPreffix} Bioinformatic Output: Value`]:
        dataByDocumentType.Bioinformatics,
      [`${fieldPreffix} Bioinformatic Output: Average`]:
        utils.getPerformanceText(
          dataByDocumentType.Bioinformatics,
          performanceByDocumentType.bioinformatics,
        ),
      [`${fieldPreffix} Dataset Output: Value`]: dataByDocumentType.Dataset,
      [`${fieldPreffix} Dataset Output: Average`]: utils.getPerformanceText(
        dataByDocumentType.Dataset,
        performanceByDocumentType.dataset,
      ),
      [`${fieldPreffix} Lab Resource Output: Value`]:
        dataByDocumentType['Lab Resource'],
      [`${fieldPreffix} Lab Resource Output: Average`]:
        utils.getPerformanceText(
          dataByDocumentType['Lab Resource'],
          performanceByDocumentType.labResource,
        ),
      [`${fieldPreffix} Protocol Output: Value`]: dataByDocumentType.Protocol,
      [`${fieldPreffix} Protocol Output: Average`]: utils.getPerformanceText(
        dataByDocumentType.Protocol,
        performanceByDocumentType.protocol,
      ),
    };
  };

export const teamCollaborationAcrossTeamToCSV =
  (performance: TeamCollaborationPerformance, outputType: 'all' | 'public') =>
  (data: TeamCollaborationDataObject) => {
    const { byDocumentType: dataByDocumentType, byTeam } =
      data.outputsCoProducedAcross;
    const performanceByDocumentType = performance.acrossTeam;

    const fieldPreffix = outputType === 'all' ? 'ASAP' : 'ASAP Public';

    const acrossTeamData = byTeam.reduce(
      (
        byTeamByDocumentType: {
          article: number;
          articleTeams: string[];
          bioinformatics: number;
          bioinformaticsTeams: string[];
          dataset: number;
          datasetTeams: string[];
          labResource: number;
          labResourceTeams: string[];
          protocol: number;
          protocolTeams: string[];
        },
        teamData,
      ) => {
        const newByTeamByDocumentType = { ...byTeamByDocumentType };
        if (teamData.Article > 0) {
          newByTeamByDocumentType.article += 1;
          newByTeamByDocumentType.articleTeams.push(teamData.name);
        }

        if (teamData.Bioinformatics > 0) {
          newByTeamByDocumentType.bioinformatics += 1;
          newByTeamByDocumentType.bioinformaticsTeams.push(teamData.name);
        }

        if (teamData.Dataset > 0) {
          newByTeamByDocumentType.dataset += 1;
          newByTeamByDocumentType.datasetTeams.push(teamData.name);
        }

        if (teamData['Lab Resource'] > 0) {
          newByTeamByDocumentType.labResource += 1;
          newByTeamByDocumentType.labResourceTeams.push(teamData.name);
        }

        if (teamData.Protocol > 0) {
          newByTeamByDocumentType.protocol += 1;
          newByTeamByDocumentType.protocolTeams.push(teamData.name);
        }

        return newByTeamByDocumentType;
      },

      {
        article: 0,
        articleTeams: [],
        bioinformatics: 0,
        bioinformaticsTeams: [],
        dataset: 0,
        datasetTeams: [],
        labResource: 0,
        labResourceTeams: [],
        protocol: 0,
        protocolTeams: [],
      },
    );

    return {
      Team: data.name,
      'Team Status': data.inactiveSince ? 'Inactive' : 'Active',
      'Inactive Since': data.inactiveSince || '',
      [`${fieldPreffix} Article Output: Value`]: dataByDocumentType.Article,
      [`${fieldPreffix} Article Output: Average`]: utils.getPerformanceText(
        dataByDocumentType.Article,
        performanceByDocumentType.article,
      ),
      [`${fieldPreffix} Article Output: No. of teams collaborated with`]:
        acrossTeamData.article,
      [`${fieldPreffix} Article Output: Name of teams collaborated with`]:
        acrossTeamData.articleTeams.join(', '),
      [`${fieldPreffix} Bioinformatic Output: Value`]:
        dataByDocumentType.Bioinformatics,
      [`${fieldPreffix} Bioinformatic Output: Average`]:
        utils.getPerformanceText(
          dataByDocumentType.Bioinformatics,
          performanceByDocumentType.bioinformatics,
        ),
      [`${fieldPreffix} Bioinformatics Output: No. of teams collaborated with`]:
        acrossTeamData.bioinformatics,
      [`${fieldPreffix} Bioinformatics Output: Name of teams collaborated with`]:
        acrossTeamData.bioinformaticsTeams.join(', '),
      [`${fieldPreffix} Dataset Output: Value`]: dataByDocumentType.Dataset,
      [`${fieldPreffix} Dataset Output: Average`]: utils.getPerformanceText(
        dataByDocumentType.Dataset,
        performanceByDocumentType.dataset,
      ),
      [`${fieldPreffix} Dataset Output: No. of teams collaborated with`]:
        acrossTeamData.dataset,
      [`${fieldPreffix} Dataset Output: Name of teams collaborated with`]:
        acrossTeamData.datasetTeams.join(', '),
      [`${fieldPreffix} Lab Resource Output: Value`]:
        dataByDocumentType['Lab Resource'],
      [`${fieldPreffix} Lab Resource Output: Average`]:
        utils.getPerformanceText(
          dataByDocumentType['Lab Resource'],
          performanceByDocumentType.labResource,
        ),
      [`${fieldPreffix} Lab Resource Output: No. of teams collaborated with`]:
        acrossTeamData.labResource,
      [`${fieldPreffix} Lab Resource Output: Name of teams collaborated with`]:
        acrossTeamData.labResourceTeams.join(', '),
      [`${fieldPreffix} Protocol Output: Value`]: dataByDocumentType.Protocol,
      [`${fieldPreffix} Protocol Output: Average`]: utils.getPerformanceText(
        dataByDocumentType.Protocol,
        performanceByDocumentType.protocol,
      ),
      [`${fieldPreffix} Protocol Output: No. of teams collaborated with`]:
        acrossTeamData.protocol,
      [`${fieldPreffix} Protocol Output: Name of teams collaborated with`]:
        acrossTeamData.protocolTeams.join(', '),
    };
  };
