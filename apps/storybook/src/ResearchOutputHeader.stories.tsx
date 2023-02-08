import { researchOutputDocumentTypes } from '@asap-hub/model';
import { ResearchOutputHeader } from '@asap-hub/react-components';
import { boolean, select } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Research Output Header',
  component: ResearchOutputHeader,
};

export const Normal = () => (
  <ResearchOutputHeader
    workingGroupAssociation={boolean('Working Group Association', true)}
    documentType={select(
      'Choose document type',
      researchOutputDocumentTypes,
      'Article',
    )}
  />
);
