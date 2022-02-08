import { TeamCreateOutputExtraInformationCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Team Profile / Team Create Output Extra Information Card',
  component: TeamCreateOutputExtraInformationCard,
};

const suggestions = ['A53T', 'Activity assay'];

export const Normal = () => (
  <TeamCreateOutputExtraInformationCard values={[]} suggestions={suggestions} />
);
export const Filled = () => (
  <TeamCreateOutputExtraInformationCard
    values={suggestions}
    suggestions={suggestions}
  />
);
