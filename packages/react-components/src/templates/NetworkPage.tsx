import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import NetworkPageHeader from './NetworkPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const articleStyles = css({
  alignSelf: 'stretch',
});

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type NetworkPageProps = {
  onChangeSearch?: (newQuery: string) => void;
  onChangeFilter?: (filter: string) => void;
  onChangeToggle?: () => void;
  searchQuery?: string;
  page: 'teams' | 'users';
  filters?: Set<string>;
};
const NetworkPage: React.FC<NetworkPageProps> = ({
  children,
  onChangeSearch,
  searchQuery,
  onChangeToggle,
  page,
  onChangeFilter,
  filters,
}) => (
  <article css={articleStyles}>
    <NetworkPageHeader
      onChangeToggle={onChangeToggle}
      page={page}
      onChangeSearch={onChangeSearch}
      searchQuery={searchQuery}
      onChangeFilter={onChangeFilter}
      filters={filters}
    />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NetworkPage;
