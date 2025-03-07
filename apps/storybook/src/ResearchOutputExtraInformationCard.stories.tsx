import { researchTagsResponse } from '@asap-hub/fixtures';
import { researchOutputDocumentTypes } from '@asap-hub/model';
import { ResearchOutputExtraInformationCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

import { select } from './knobs';

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
  documentType: select('type', researchOutputDocumentTypes, 'Article'),
};

export const Normal = () => (
  <ResearchOutputExtraInformationCard {...commonProps} />
);
export const Filled = () => (
  <ResearchOutputExtraInformationCard {...commonProps} tags={tagSuggestions} />
);
