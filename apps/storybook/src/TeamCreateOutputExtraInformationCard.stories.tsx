import { TeamCreateOutputExtraInformationCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import {
  ResearchOutputIdentifierType,
  researchOutputTypes,
} from '@asap-hub/model';
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
    tagSuggestions: tagSuggestions.map((suggestion) => ({
      label: suggestion,
      value: suggestion,
    })),
    identifierType: ResearchOutputIdentifierType.None,
    setIdentifierType: () => {},
    identifier: '',
    setIdentifier: () => {},
    type: select('type', researchOutputTypes, 'Article'),
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
