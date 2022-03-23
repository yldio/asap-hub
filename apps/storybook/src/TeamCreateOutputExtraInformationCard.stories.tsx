import {
  TeamCreateOutputExtraInformationCard,
  ResearchOutputIdentifierType,
} from '@asap-hub/react-components';
import { ComponentProps } from 'react';

export default {
  title: 'Organisms / Team Profile / Team Create Output Extra Information Card',
  component: TeamCreateOutputExtraInformationCard,
};

const tagSuggestions = ['A53T', 'Activity assay'];

const commonProps: ComponentProps<typeof TeamCreateOutputExtraInformationCard> =
  {
    isSaving: false,
    tags: [],
    tagSuggestions: tagSuggestions.map((suggestion) => ({
      label: suggestion,
      value: suggestion,
    })),
    identifierType: ResearchOutputIdentifierType.None,
    setIdentifierType: () => {},
    identifier: '',
    setIdentifier: () => {},
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
