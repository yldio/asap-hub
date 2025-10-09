import {
  PreprintComplianceResponse,
  PublicationComplianceResponse,
} from '@asap-hub/model';
import { formatPercentage, getPerformanceRanking } from '../utils/export';

export const preprintComplianceToCSV = (data: PreprintComplianceResponse) => ({
  'Team Name': data.teamName,
  'Team Status': data.isTeamInactive ? 'Inactive' : 'Active',
  'Number of Preprints': data.numberOfPreprints,
  'Posted Prior to Journal Submission': formatPercentage(
    data.postedPriorPercentage,
  ),
  Ranking: getPerformanceRanking(
    data.postedPriorPercentage,
    data.postedPriorPercentage === null,
  ),
});

export const publicationComplianceToCSV = (
  data: PublicationComplianceResponse,
) => ({
  'Team Name': data.teamName,
  'Team Status': data.isTeamInactive ? 'Inactive' : 'Active',
  Publication: formatPercentage(data.overallCompliance ?? null),
  'Publication Ranking': getPerformanceRanking(
    data.overallCompliance ?? null,
    data.overallCompliance === null,
  ),
  Datasets: formatPercentage(data.datasetsPercentage ?? null),
  'Datasets Ranking': getPerformanceRanking(
    data.datasetsPercentage ?? null,
    data.datasetsRanking === 'LIMITED DATA',
  ),
  Protocols: formatPercentage(data.protocolsPercentage ?? null),
  'Protocols Ranking': getPerformanceRanking(
    data.protocolsPercentage ?? null,
    data.protocolsRanking === 'LIMITED DATA',
  ),
  Code: formatPercentage(data.codePercentage ?? null),
  'Code Ranking': getPerformanceRanking(
    data.codePercentage ?? null,
    data.codeRanking === 'LIMITED DATA',
  ),
  'Lab Materials': formatPercentage(data.labMaterialsPercentage ?? null),
  'Lab Materials Ranking': getPerformanceRanking(
    data.labMaterialsPercentage ?? null,
    data.labMaterialsRanking === 'LIMITED DATA',
  ),
});
