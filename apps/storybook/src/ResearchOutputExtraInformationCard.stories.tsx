import { ResearchOutputExtraInformationCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { researchOutputDocumentTypes } from '@asap-hub/model';
import { boolean, select } from '@storybook/addon-knobs';
import { researchTagsResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Team Profile / Team Create Output Extra Information Card',
  component: ResearchOutputExtraInformationCard,
};

const tagSuggestions = ['A53T', 'Activity assay'];

const commonProps: ComponentProps<typeof ResearchOutputExtraInformationCard> = {
  isSaving: false,
  tags: [],
  methods: [],
  organisms: [],
  tagSuggestions: tagSuggestions.map((suggestion) => ({
    label: suggestion,
    value: suggestion,
  })),
  getResearchTags: () => Promise.resolve(researchTagsResponse),
  type: 'Protein Data',
  documentType: select('type', researchOutputDocumentTypes, 'Article'),
  identifierRequired: boolean('identifierRequired', false),
};

export const Normal = () => (
  <ResearchOutputExtraInformationCard {...commonProps} />
);
export const Filled = () => (
  <ResearchOutputExtraInformationCard {...commonProps} tags={tagSuggestions} />
);
