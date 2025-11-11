import { css } from '@emotion/react';

import { Display, Paragraph } from '../atoms';
import { mobileScreen, rem, smallDesktopScreen } from '../pixels';
import { noop } from '../utils';
import ResearchOutputsSearch from './ResearchOutputsSearch';
import { SharedOutputDropdown } from '../organisms';
import PageInfoContainer from './PageInfoContainer';
import PageContraints from './PageConstraints';

const textStyles = css({
  display: 'grid',
  columnGap: rem(39),
  rowGap: rem(9),
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    gridTemplateColumns: `minmax(auto, ${smallDesktopScreen.width}px) auto`,
  },
});

const buttonStyles = css({
  alignContent: 'center',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'block',
    justifySelf: 'flex-end',
  },
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
    <PageInfoContainer>
      <Display styleAsHeading={2}>Shared Research</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          This page contains all shared research from the research teams. As
          teams begin to share more items, this library will grow. Teams should
          be mindful to respect intellectual boundaries and not share outside of
          the Network
        </Paragraph>
        <div css={buttonStyles}>
          <SharedOutputDropdown />
        </div>
      </div>
    </PageInfoContainer>

    <PageContraints noPaddingBottom>
      <ResearchOutputsSearch
        onChangeSearch={onChangeSearch}
        searchQuery={searchQuery}
        onChangeFilter={onChangeFilter}
        filters={filters}
      />
    </PageContraints>
  </header>
);

export default SharedResearchPageHeader;
