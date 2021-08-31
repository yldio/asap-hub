import { ResearchOutputType } from '@asap-hub/model';
import { css } from '@emotion/react';
import React from 'react';
import { SearchAndFilter } from '../organisms';
import { perRem } from '../pixels';
import { Option } from '../organisms/CheckboxGroup';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

export type TeamProfileOutputsHeaderProps = {
  setSearchQuery: (newSearchQuery: string) => void;
  searchQuery: string;
  onChangeFilter: (filter: string) => void;
  filters: Set<string>;
};

const researchOutputFilters: Option<ResearchOutputType>[] = [
  { label: 'Proposal', value: 'Proposal' },
  { label: 'Presentation', value: 'Presentation' },
  { label: 'Protocol', value: 'Protocol' },
  { label: 'Dataset', value: 'Dataset' },
  { label: 'Bioinformatics', value: 'Bioinformatics' },
  { label: 'Lab Resource', value: 'Lab Resource' },
  { label: 'Article', value: 'Article' },
];

const TeamProfileOutputsHeader: React.FC<TeamProfileOutputsHeaderProps> = ({
  setSearchQuery,
  searchQuery,
  onChangeFilter,
  filters,
}) => {
  return (
    <div css={containerStyles}>
      <SearchAndFilter
        searchPlaceholder="Enter a keyword, method, resource…"
        onChangeSearch={setSearchQuery}
        searchQuery={searchQuery}
        filterOptions={researchOutputFilters}
        filterTitle="TYPE OF OUTPUTS"
        onChangeFilter={onChangeFilter}
        filters={filters}
      />
    </div>
  );
};

export default TeamProfileOutputsHeader;
