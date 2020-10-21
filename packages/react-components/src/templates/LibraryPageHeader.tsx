import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { noop } from '../utils';
import { SearchControls } from '../organisms';

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

type LibraryPageHeaderProps = {
  onChangeSearch?: (newQuery: string) => void;
  searchQuery?: string;
  onChangeFilter?: (filters: string) => void;
  filters: Set<string>;
};

const LibraryPageHeader: React.FC<LibraryPageHeaderProps> = ({
  onChangeSearch = noop,
  searchQuery,
  filters,
  onChangeFilter,
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
      <SearchControls
        placeholder="Search for a protein, a method…"
        onChangeSearch={onChangeSearch}
        searchQuery={searchQuery}
        filterEnabled={false}
        filterOptions={[
          { label: 'Proposal', value: 'Proposal' },
          { label: 'Dataset', value: 'Dataset', enabled: false },
          { label: 'Software', value: 'Software', enabled: false },
          { label: 'Protocol', value: 'Protocol', enabled: false },
          { label: 'Lab Resource', value: 'Lab Resource', enabled: false },
          { label: 'Preprint', value: 'Preprint', enabled: false },
          { label: 'Article', value: 'Article', enabled: false },
          { label: 'Other', value: 'Other', enabled: false },
        ]}
        filterTitle="TYPE OF OUTPUTS"
        onChangeFilter={onChangeFilter}
        filters={filters}
      />
    </header>
  );
};

export default LibraryPageHeader;
