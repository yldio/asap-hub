import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
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

type FilterPillProps = ComponentProps<typeof FilterPill>;

interface FilterPillsProps {
  values: FilterPillProps['value'][];
  onRemove: FilterPillProps['onRemove'];
}

const FilterPills: React.FC<FilterPillsProps> = ({ values, onRemove }) => (
  <div css={containerStyles}>
    {values.map((value) => (
      <FilterPill key={value.id} value={value} onRemove={onRemove} />
    ))}
  </div>
);

export default FilterPills;
