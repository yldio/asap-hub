import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  tabletScreen,
  mobileScreen,
  vminLinearCalcClamped,
} from '../pixels';

import LibraryPageHeader from './LibraryPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  alignSelf: 'stretch',
  display: 'grid',
  gridRowGap: `${vminLinearCalcClamped(
    mobileScreen,
    24,
    tabletScreen,
    36,
    'px',
  )}`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const articleStyles = css({
  alignSelf: 'stretch',
  padding: `0 0 ${vminLinearCalcClamped(
    mobileScreen,
    36,
    tabletScreen,
    72,
    'px',
  )}`,
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
