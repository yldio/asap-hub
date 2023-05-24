import { DropdownButton, LibraryIcon } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Dropdown Button',
  component: DropdownButton,
};

export const Normal = () => (
  <DropdownButton
    buttonChildren={(menuShown) => (menuShown ? 'open' : 'closed')}
  >
    {{
      item: (
        <>
          <LibraryIcon /> Article
        </>
      ),
      href: '#',
    }}
    {{
      item: (
        <>
          <LibraryIcon /> Bioinformatics
        </>
      ),
      href: '#',
    }}
    {{
      item: (
        <>
          <LibraryIcon /> Dataset
        </>
      ),
      href: '#',
    }}
  </DropdownButton>
);
