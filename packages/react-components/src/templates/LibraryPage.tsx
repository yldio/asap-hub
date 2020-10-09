import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';

import LibraryPageHeader from './LibraryPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const articleStyles = css({
  alignSelf: 'stretch',
});

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type LibraryPageProps = {
  onChangeSearch?: (newQuery: string) => void;
  query: string;
};
const LibraryPage: React.FC<LibraryPageProps> = ({
  onChangeSearch,
  query,
  children,
}) => {
  return (
    <article css={articleStyles}>
      <LibraryPageHeader onChangeSearch={onChangeSearch} query={query} />
      <main css={mainStyles}>{children}</main>
    </article>
  );
};

export default LibraryPage;
