import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph, Button } from '../atoms';
import { SearchField } from '../molecules';
import { perRem, tabletScreen } from '../pixels';
import { paper, steel } from '../colors';
import { filterIcon } from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { noop } from '../utils';

const containerStyles = css({
  alignSelf: 'stretch',
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: '2px',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

const searchContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto min-content',
  gridColumnGap: `${18 / perRem}em`,
  alignItems: 'center',
});

const buttonTextStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

type LibraryPageHeaderProps = {
  onChangeSearch?: (newQuery: string) => void;
  query: string;
};

const LibraryPageHeader: React.FC<LibraryPageHeaderProps> = ({
  onChangeSearch = noop,
  query,
}) => {
  return (
    <header css={containerStyles}>
      <Display styleAsHeading={2}>Library</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          The ASAP Network's library contains all shared outputs from the
          research teams, beginning with each team's proposal. As teams begin to
          share more items, this library will grow.
        </Paragraph>
      </div>
      <div css={searchContainerStyles}>
        <SearchField
          value={query}
          placeholder="Search for a protein, a method…"
          onChange={onChangeSearch}
        />
        <Button enabled={false}>
          {filterIcon}
          <span css={buttonTextStyles}>Filters</span>
        </Button>
      </div>
    </header>
  );
};

export default LibraryPageHeader;
