import { FetchUsersFilter } from '@asap-hub/model/src/gp2';
import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { FilterPill } from '../molecules';

const { rem } = pixels;

interface FilterPillsProps {
  filters: FetchUsersFilter;
}
const containerStyles = css({
  padding: rem(10),
});

const addPill = (item: string) => <FilterPill>{item}</FilterPill>;

const FilterPills: React.FC<FilterPillsProps> = ({ filters }) => (
  <div css={containerStyles}>
    {filters.regions?.map((x) => addPill(x))}
    {filters.keywords?.map((x) => addPill(x))}
    {filters.projects?.map((x) => addPill(x))}
    {filters.workingGroups?.map((x) => addPill(x))}
  </div>
);

export default FilterPills;
