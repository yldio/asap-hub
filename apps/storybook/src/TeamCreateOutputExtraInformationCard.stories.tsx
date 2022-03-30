import { TeamCreateOutputExtraInformationCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Team Profile / Team Create Output Extra Information Card',
  component: TeamCreateOutputExtraInformationCard,
};

const tagSuggestions = ['A53T', 'Activity assay'];

export const Normal = () => (
  <TeamCreateOutputExtraInformationCard
    isSaving={false}
    tags={[]}
    tagSuggestions={tagSuggestions.map((suggestion) => ({
      label: suggestion,
      value: suggestion,
    }))}
  />
);
export const Filled = () => (
  <TeamCreateOutputExtraInformationCard
    isSaving={false}
    tags={tagSuggestions}
    tagSuggestions={tagSuggestions.map((suggestion) => ({
      label: suggestion,
      value: suggestion,
    }))}
  />
);
