import React from 'react';
import css from '@emotion/css';
import { ResearchOutputType } from '@asap-hub/model';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { noop } from '../utils';
import { SearchControls } from '../organisms';
import { Option } from '../organisms/CheckboxGroup';

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

type SharedResearchPageHeaderProps = {
  onChangeSearch?: (newQuery: string) => void;
  searchQuery?: string;
  onChangeFilter?: (filters: string) => void;
  filters: Set<string>;
};

const researchOutputFilters: Option<ResearchOutputType>[] = [
  { label: 'Proposal', value: 'Proposal' },
  { label: 'Presentation', value: 'Presentation' },
  { label: 'Protocol', value: 'Protocol' },
  { label: 'Dataset', value: 'Dataset', enabled: false },
  { label: 'Software', value: 'Code', enabled: false },
  { label: 'Lab Resource', value: 'Lab Resource', enabled: false },
  { label: 'Preprint', value: 'Preprint', enabled: false },
  { label: 'Article', value: 'Article', enabled: false },
];

const SharedResearchPageHeader: React.FC<SharedResearchPageHeaderProps> = ({
  onChangeSearch = noop,
  searchQuery,
  filters,
  onChangeFilter,
}) => {
  return (
    <header css={containerStyles}>
      <Display styleAsHeading={2}>Shared Research</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          This page contains all shared outputs from the research teams. As
          teams begin to share more items, this library will grow. Teams should
          be mindful to respect intellectual boundaries and not share outside of
          the Network
        </Paragraph>
      </div>
      <SearchControls
        placeholder="Enter a keyword, method, resource, tool, etc"
        onChangeSearch={onChangeSearch}
        searchQuery={searchQuery}
        filterEnabled={true}
        filterOptions={researchOutputFilters}
        filterTitle="TYPE OF OUTPUTS"
        onChangeFilter={onChangeFilter}
        filters={filters}
      />
    </header>
  );
};

export default SharedResearchPageHeader;
