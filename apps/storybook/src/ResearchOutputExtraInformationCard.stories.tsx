import { researchTagsResponse } from '@asap-hub/fixtures';
import { researchOutputDocumentTypes } from '@asap-hub/model';
import { ResearchOutputExtraInformationCard } from '@asap-hub/react-components';
import { select } from '@storybook/addon-knobs';
import { ComponentProps } from 'react';

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
  environments: [],
  tagSuggestions: tagSuggestions.map((suggestion) => ({
    label: suggestion,
    value: suggestion,
  })),
  researchTags: researchTagsResponse,
  type: 'Protein Data',
  documentType: select('type', researchOutputDocumentTypes, 'Article'),
};

export const Normal = () => (
  <ResearchOutputExtraInformationCard {...commonProps} />
);
export const Filled = () => (
  <ResearchOutputExtraInformationCard {...commonProps} tags={tagSuggestions} />
);
