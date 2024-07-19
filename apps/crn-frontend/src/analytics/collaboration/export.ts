import {
  TeamCollaborationDataObject,
  TeamCollaborationPerformance,
  UserCollaborationDataObject,
  UserCollaborationPerformance,
} from '@asap-hub/model';
import { utils } from '@asap-hub/react-components';

export const userCollaborationToCSV =
  (
    type: 'within-team' | 'across-teams',
    performance: UserCollaborationPerformance,
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

      if (!data.teams[index]?.team) {
        return {
          ...result,
          [`Team ${teamSuffix}`]: '',
          [`Team Status ${teamSuffix}`]: '',
          [`Team Inactive Since ${teamSuffix}`]: '',
          [`Role ${teamSuffix}`]: '',
          [`User Team Status ${teamSuffix}`]: '',
          [`User Team Inactive Since ${teamSuffix}`]: '',
          [`Outputs Co-Authored: Value ${teamSuffix}`]: '',
          [`Outputs Co-Authored: Average ${teamSuffix}`]: '',
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
        [`Outputs Co-Authored: Value ${teamSuffix}`]: value,
        [`Outputs Co-Authored: Average ${teamSuffix}`]:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          utils.getPerformanceText(value!, performanceValue),
      };
    }, {}),
  });

export const teamCollaborationWithinTeamToCSV =
  (performance: TeamCollaborationPerformance) =>
  (data: TeamCollaborationDataObject) => {
    const dataByDocumentType = data.outputsCoProducedWithin;
    const performanceByDocumentType = performance.withinTeam;

    return {
      Team: data.name,
      'Team Status': data.inactiveSince ? 'Inactive' : 'Active',
      'Inactive Since': data.inactiveSince || '',
      'ASAP Article Output: Value': dataByDocumentType.Article,
      'ASAP Article Output: Average': utils.getPerformanceText(
        dataByDocumentType.Article,
        performanceByDocumentType.article,
      ),
      'ASAP Bioinformatic Output: Value': dataByDocumentType.Bioinformatics,
      'ASAP Bioinformatic Output: Average': utils.getPerformanceText(
        dataByDocumentType.Bioinformatics,
        performanceByDocumentType.bioinformatics,
      ),
      'ASAP Dataset Output: Value': dataByDocumentType.Dataset,
      'ASAP Dataset Output: Average': utils.getPerformanceText(
        dataByDocumentType.Dataset,
        performanceByDocumentType.dataset,
      ),
      'ASAP Lab Resource Output: Value': dataByDocumentType['Lab Resource'],
      'ASAP Lab Resource Output: Average': utils.getPerformanceText(
        dataByDocumentType['Lab Resource'],
        performanceByDocumentType.labResource,
      ),
      'ASAP Protocol Output: Value': dataByDocumentType.Protocol,
      'ASAP Protocol Output: Average': utils.getPerformanceText(
        dataByDocumentType.Protocol,
        performanceByDocumentType.protocol,
      ),
    };
  };

export const teamCollaborationAcrossTeamToCSV =
  (performance: TeamCollaborationPerformance) =>
  (data: TeamCollaborationDataObject) => {
    const { byDocumentType: dataByDocumentType, byTeam } =
      data.outputsCoProducedAcross;
    const performanceByDocumentType = performance.acrossTeam;

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
      'ASAP Article Output: Value': dataByDocumentType.Article,
      'ASAP Article Output: Average': utils.getPerformanceText(
        dataByDocumentType.Article,
        performanceByDocumentType.article,
      ),
      'ASAP Output Article: No. of teams collaborated with':
        acrossTeamData.article,
      'ASAP Output Article: Name of teams collaborated with':
        acrossTeamData.articleTeams.join(', '),
      'ASAP Bioinformatic Output: Value': dataByDocumentType.Bioinformatics,
      'ASAP Bioinformatic Output: Average': utils.getPerformanceText(
        dataByDocumentType.Bioinformatics,
        performanceByDocumentType.bioinformatics,
      ),
      'ASAP Output Bioinformatics: No. of teams collaborated with':
        acrossTeamData.bioinformatics,
      'ASAP Output Bioinformatics: Name of teams collaborated with':
        acrossTeamData.bioinformaticsTeams.join(', '),
      'ASAP Dataset Output: Value': dataByDocumentType.Dataset,
      'ASAP Dataset Output: Average': utils.getPerformanceText(
        dataByDocumentType.Dataset,
        performanceByDocumentType.dataset,
      ),
      'ASAP Output Dataset: No. of teams collaborated with':
        acrossTeamData.dataset,
      'ASAP Output Dataset: Name of teams collaborated with':
        acrossTeamData.datasetTeams.join(', '),
      'ASAP Lab Resource Output: Value': dataByDocumentType['Lab Resource'],
      'ASAP Lab Resource Output: Average': utils.getPerformanceText(
        dataByDocumentType['Lab Resource'],
        performanceByDocumentType.labResource,
      ),
      'ASAP Output Lab Resource: No. of teams collaborated with':
        acrossTeamData.labResource,
      'ASAP Output Lab Resource: Name of teams collaborated with':
        acrossTeamData.labResourceTeams.join(', '),
      'ASAP Protocol Output: Value': dataByDocumentType.Protocol,
      'ASAP Protocol Output: Average': utils.getPerformanceText(
        dataByDocumentType.Protocol,
        performanceByDocumentType.protocol,
      ),
      'ASAP Output Protocol: No. of teams collaborated with':
        acrossTeamData.protocol,
      'ASAP Output Protocol: Name of teams collaborated with':
        acrossTeamData.protocolTeams.join(', '),
    };
  };
