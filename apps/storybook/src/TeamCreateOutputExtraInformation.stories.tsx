import { TeamCreateOutputExtraInformationCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Team Profile / Team Create Output Extra Information Card',
  component: TeamCreateOutputExtraInformationCard,
};

export const Normal = () => (
  <TeamCreateOutputExtraInformationCard values={[]} />
);
export const Filled = () => (
  <TeamCreateOutputExtraInformationCard values={['A53T', 'Activity assay']} />
);
