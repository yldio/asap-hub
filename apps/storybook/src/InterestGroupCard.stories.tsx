import { InterestGroupCard } from '@asap-hub/react-components';
import { text, array, number, boolean } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Network / Interest Group Card',
};

export const Normal = () => (
  <InterestGroupCard
    id="42"
    name={text('Name', 'My Group')}
    description={text('Description', 'Group Description')}
    tags={array('Tags', ['Tag 1', 'Tag 2'])}
    numberOfTeams={number('Number of Teams', 3)}
    active={boolean('Is the group active?', true)}
  />
);
