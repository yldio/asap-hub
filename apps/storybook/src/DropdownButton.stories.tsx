import { DropdownButton, libraryIcon } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Dropdown Button',
  component: DropdownButton,
};

export const Normal = () => (
  <DropdownButton
    buttonChildren={(menuShown) => (menuShown ? 'open' : 'closed')}
  >
    {{ item: <>{libraryIcon} Article</>, href: '#' }}
    {{ item: <>{libraryIcon} Bioinformatics</>, href: '#' }}
    {{ item: <>{libraryIcon} Dataset</>, href: '#' }}
  </DropdownButton>
);
