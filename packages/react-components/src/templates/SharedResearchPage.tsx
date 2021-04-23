import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';

import SharedResearchPageHeader from './SharedResearchPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type SharedResearchPageProps = ComponentProps<typeof SharedResearchPageHeader>;
const SharedResearchPage: React.FC<SharedResearchPageProps> = ({
  onChangeSearch,
  searchQuery,
  children,
  onChangeFilter,
  filters,
}) => (
  <article>
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
