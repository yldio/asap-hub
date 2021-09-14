import { css } from '@emotion/react';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { noop } from '../utils';
import ResearchOutputsSearch from './ResearchOutputsSearch';

const visualHeaderStyles = css({
  marginBottom: `${30 / perRem}em`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const controlsStyles = css({
  padding: `0 ${contentSidePaddingWithNavigation(8)}`,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

type SharedResearchPageHeaderProps = {
  onChangeSearch?: (newQuery: string) => void;
  searchQuery: string;
  onChangeFilter?: (filters: string) => void;
  filters: Set<string>;
};

const SharedResearchPageHeader: React.FC<SharedResearchPageHeaderProps> = ({
  onChangeSearch = noop,
  searchQuery,
  filters,
  onChangeFilter = noop,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Shared Research</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          This page contains all shared research from the research teams. As
          teams begin to share more items, this library will grow. Teams should
          be mindful to respect intellectual boundaries and not share outside of
          the Network
        </Paragraph>
      </div>
    </div>
    <div css={controlsStyles}>
      <ResearchOutputsSearch
        onChangeSearch={onChangeSearch}
        searchQuery={searchQuery}
        onChangeFilter={onChangeFilter}
        filters={filters}
      />
    </div>
  </header>
);

export default SharedResearchPageHeader;
