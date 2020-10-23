import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';

import SharedResearchPageHeader from './SharedResearchPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const articleStyles = css({
  alignSelf: 'stretch',
});

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type SharedResearchPageProps = {
  onChangeSearch?: (newQuery: string) => void;
  searchQuery?: string;
  onChangeFilter?: (filter: string) => void;
  filters: Set<string>;
};
const SharedResearchPage: React.FC<SharedResearchPageProps> = ({
  onChangeSearch,
  searchQuery,
  children,
  onChangeFilter,
  filters,
}) => (
  <article css={articleStyles}>
    <SharedResearchPageHeader
      onChangeSearch={onChangeSearch}
      searchQuery={searchQuery}
      onChangeFilter={onChangeFilter}
      filters={filters}
    />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default SharedResearchPage;
