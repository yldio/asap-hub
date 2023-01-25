import { gp2 as gp2Model } from '@asap-hub/model';
import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import FilterPill from '../molecules/FilterPill';

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  gap: rem(8),
  paddingTop: rem(24),
});

type FiltersType = keyof Pick<
  gp2Model.FetchUsersFilter,
  'keywords' | 'regions' | 'workingGroups' | 'projects'
>;
type FilterPillsProps = {
  pills: { typeOfFilter: FiltersType; label: string; id: string }[];
  onRemove: (id: string, typeOfFilter: FiltersType) => void;
};

const FilterPills: React.FC<FilterPillsProps> = ({ pills, onRemove }) => (
  <div css={containerStyles}>
    {pills.map(({ id, label, typeOfFilter }) => (
      <FilterPill
        key={`filter-pill-${id}`}
        onRemove={() => onRemove(id, typeOfFilter)}
      >
        {label}
      </FilterPill>
    ))}
  </div>
);

export default FilterPills;
