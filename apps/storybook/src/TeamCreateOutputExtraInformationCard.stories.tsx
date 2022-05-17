import { TeamCreateOutputExtraInformationCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { researchOutputDocumentTypes } from '@asap-hub/model';
import { boolean, select } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Team Profile / Team Create Output Extra Information Card',
  component: TeamCreateOutputExtraInformationCard,
};

const tagSuggestions = ['A53T', 'Activity assay'];

const commonProps: ComponentProps<typeof TeamCreateOutputExtraInformationCard> =
  {
    isSaving: false,
    tags: [],
    methods: [],
    tagSuggestions: tagSuggestions.map((suggestion) => ({
      label: suggestion,
      value: suggestion,
    })),
    getResearchTags: () =>
      Promise.resolve([
        {
          id: '1234',
          name: 'Activity Assay',
          category: 'Method',
          types: ['Protein Data', 'Assay'],
          entities: ['Research Output'],
        },
      ]),
    type: 'Protein Data',
    documentType: select('type', researchOutputDocumentTypes, 'Article'),
    identifierRequired: boolean('identifierRequired', false),
  };

export const Normal = () => (
  <TeamCreateOutputExtraInformationCard {...commonProps} />
);
export const Filled = () => (
  <TeamCreateOutputExtraInformationCard
    {...commonProps}
    tags={tagSuggestions}
  />
);
