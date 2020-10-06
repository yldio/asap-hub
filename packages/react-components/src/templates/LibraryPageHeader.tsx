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
      <SearchControls
        placeholder="Search for a protein, a method…"
        onChangeSearch={onChangeSearch}
        query={query}
        filterOptions={[
          { label: 'Proposal', value: '' },
          { label: 'Dataset', value: '', disabled: true },
          { label: 'Software', value: '', disabled: true },
          { label: 'Protocol', value: '', disabled: true },
          { label: 'Lab Resource', value: '', disabled: true },
          { label: 'Preprint', value: '', disabled: true },
          { label: 'Article', value: '', disabled: true },
          { label: 'Other', value: '', disabled: true },
        ]}
        filterTitle="TYPE OF OUTPUTS"
      />
    </header>
  );
};

export default LibraryPageHeader;
