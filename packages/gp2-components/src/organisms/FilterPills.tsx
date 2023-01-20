import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import FilterPill, { ValueProps } from '../molecules/FilterPill';

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  paddingTop: rem(24),
});

interface FilterPillsProps {
  values: ValueProps[];
  onRemove: (value: ValueProps) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ values, onRemove }) => (
  <div css={containerStyles}>
    {values.map((value) => (
      <FilterPill key={value.id} value={value} onRemove={onRemove} />
    ))}
  </div>
);

export default FilterPills;
