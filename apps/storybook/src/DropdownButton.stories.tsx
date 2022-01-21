import { DropdownButton, Anchor } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Dropdown Button',
  component: DropdownButton,
};

export const Normal = () => (
  <DropdownButton
    buttonChildren={(menuShown) => (menuShown ? 'open' : 'closed')}
  >
    <Anchor href="#">Article</Anchor>
    <Anchor href="#">Bioinformatics</Anchor>
    <Anchor href="#">Dataset</Anchor>
  </DropdownButton>
);
