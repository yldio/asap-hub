import { FetchUsersFilter } from '@asap-hub/model/src/gp2';
import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { FilterPill } from '../molecules';

const { rem } = pixels;

interface FilterPillsProps {
  filters: FetchUsersFilter;
}
const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  paddingTop: rem(24),
});

const FilterPills: React.FC<FilterPillsProps> = ({ filters }) => (
  <div css={containerStyles}>
    {filters.regions?.map((filter, index) => (
      <FilterPill key={`region-${index}`} filter={filter} />
    ))}
    {filters.keywords?.map((filter, index) => (
      <FilterPill key={`keyword-${index}`} filter={filter} />
    ))}
    {filters.projects?.map((filter, index) => (
      <FilterPill key={`project-${index}`} filter={filter} />
    ))}
    {filters.workingGroups?.map((filter, index) => (
      <FilterPill key={`workingGroup-${index}`} filter={filter} />
    ))}
  </div>
);

export default FilterPills;
