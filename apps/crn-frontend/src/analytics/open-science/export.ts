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
  '# Publications': data.numberOfPublications,
  'Publications %': formatPercentage(data.overallCompliance ?? null),
  'Publications Ranking': getPerformanceRanking(
    data.overallCompliance ?? null,
    data.overallCompliance === null,
  ),
  '# Outputs': data.numberOfOutputs,
  '# Datasets': data.numberOfDatasets,
  'Datasets %': formatPercentage(data.datasetsPercentage ?? null),
  'Datasets Ranking': getPerformanceRanking(
    data.datasetsPercentage ?? null,
    data.datasetsRanking === 'LIMITED DATA',
  ),
  '# Protocols': data.numberOfProtocols,
  'Protocols %': formatPercentage(data.protocolsPercentage ?? null),
  'Protocols Ranking': getPerformanceRanking(
    data.protocolsPercentage ?? null,
    data.protocolsRanking === 'LIMITED DATA',
  ),
  '# Code': data.numberOfCode,
  'Code %': formatPercentage(data.codePercentage ?? null),
  'Code Ranking': getPerformanceRanking(
    data.codePercentage ?? null,
    data.codeRanking === 'LIMITED DATA',
  ),
  '# Lab Materials': data.numberOfLabMaterials,
  'Lab Materials %': formatPercentage(data.labMaterialsPercentage ?? null),
  'Lab Materials Ranking': getPerformanceRanking(
    data.labMaterialsPercentage ?? null,
    data.labMaterialsRanking === 'LIMITED DATA',
  ),
});
