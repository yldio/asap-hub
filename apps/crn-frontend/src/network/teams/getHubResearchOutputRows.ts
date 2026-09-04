import {
  teamOutputDocumentTypes,
  TeamProductivityOpensearchDocument,
} from '@asap-hub/model';
import { HubResearchOutputRow } from '@asap-hub/react-components';

export const getHubResearchOutputRows = (
  all?: TeamProductivityOpensearchDocument,
  publicOutputs?: TeamProductivityOpensearchDocument,
): HubResearchOutputRow[] =>
  teamOutputDocumentTypes.map((outputType) => {
    const numberOfOutputs = all?.[outputType] ?? 0;
    const numberOfPublicOutputs = publicOutputs?.[outputType] ?? 0;

    return {
      outputType,
      numberOfOutputs,
      publicPercentage:
        numberOfOutputs === 0
          ? null
          : Math.round((numberOfPublicOutputs / numberOfOutputs) * 100),
    };
  });
