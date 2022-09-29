import { GroupCard } from '@asap-hub/react-components';
import { text, array, number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Network / Group Card',
};

export const Normal = () => (
  <GroupCard
    id="42"
    name={text('Name', 'My Group')}
    description={text('Description', 'Group Description')}
    tags={array('Tags', ['Tag 1', 'Tag 2'])}
    numberOfTeams={number('Number of Teams', 3)}
    active={true}
  />
);

export const Inactive = () => (
  <GroupCard
    id="42"
    name={text('Name', 'My Group')}
    description={text('Description', 'Group Description')}
    tags={array('Tags', ['Tag 1', 'Tag 2'])}
    numberOfTeams={number('Number of Teams', 3)}
    active={false}
  />
);
