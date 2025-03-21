import { gp2 } from '@asap-hub/fixtures';
import { UsersPageBody } from '@asap-hub/gp2-components';
import { boolean, number, text } from '../knobs';

export default {
  title: 'GP2 / Organisms / User Directory / Page Body',
  component: UsersPageBody,
};

const item = gp2.createUserResponse();

const userProps = () => {
  const numberOfItems = number('Number of Users', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;

  return {
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    onFiltersClick: () => {},
    onExportClick: () => {},
    searchQuery: text('query', ''),
    onSearchQueryChange: () => {},
    isAdministrator: boolean('Administrator', true),
    renderPageHref: (index: number) => `#${index}`,
    users: {
      total: numberOfItems,
      items: Array.from({ length: numberOfItems }, (_, i) => item).slice(
        currentPageIndex * 10,
        currentPageIndex * 10 + 10,
      ),
    },
  };
};

export const Normal = () => <UsersPageBody {...userProps()} />;
