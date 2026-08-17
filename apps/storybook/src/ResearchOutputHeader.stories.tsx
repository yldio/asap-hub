import { researchOutputDocumentTypes } from '@asap-hub/model';
import { ResearchOutputHeader } from '@asap-hub/react-components';
import { select } from './knobs';

export default {
  title: 'Organisms / Research Output Header',
  component: ResearchOutputHeader,
};

export const Normal = () => (
  <ResearchOutputHeader
    entityType={select(
      'Choose the entity type',
      ['team', 'working-group', 'project'],
      'working-group',
    )}
    documentType={select(
      'Choose document type',
      researchOutputDocumentTypes,
      'Article',
    )}
  />
);
