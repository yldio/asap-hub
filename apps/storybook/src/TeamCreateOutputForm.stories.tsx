import { TeamCreateOutputForm } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Team Profile / Team Create Output Form',
  component: TeamCreateOutputForm,
};

export const Normal = () => (
  <TeamCreateOutputForm tagSuggestions={['A53T', 'Activity assay']} />
);
