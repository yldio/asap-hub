import { SharedOutputDropdown, LibraryIcon } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Shared Output Dropdown',
  component: SharedOutputDropdown,
};

export const Normal = () => (
  <SharedOutputDropdown
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
  </SharedOutputDropdown>
);
