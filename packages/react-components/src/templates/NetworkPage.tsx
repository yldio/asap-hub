import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import NetworkPageHeader from './NetworkPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type NetworkPageProps = {
  onChangeSearch?: (newQuery: string) => void;
  query: string;
  onChangeToggle?: () => void;
  page: 'teams' | 'users';
};
const NetworkPage: React.FC<NetworkPageProps> = ({
  children,
  onChangeSearch,
  query,
  onChangeToggle,
  page,
}) => {
  return (
    <article>
      <NetworkPageHeader
        onChangeToggle={onChangeToggle}
        page={page}
        onChangeSearch={onChangeSearch}
        query={query}
      />
      <main css={mainStyles}>{children}</main>
    </article>
  );
};

export default NetworkPage;
