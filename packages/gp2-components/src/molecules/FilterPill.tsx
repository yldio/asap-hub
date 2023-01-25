import { gp2 as gp2Model } from '@asap-hub/model';
import {
  pixels,
  borderWidth,
  crossSmallIcon,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import colors from '../templates/colors';

const { rem } = pixels;

const pillStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
  height: rem(22),
  padding: `${rem(8)} ${rem(12)}`,
  gap: rem(8),
  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: rem(24),
  borderColor: colors.neutral500.rgb,
  color: colors.neutral1000.rgb,
});

const iconStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
  svg: {
    fill: colors.neutral900.rgb,
  },
});

type FiltersType = Pick<
  gp2Model.FetchUsersFilter,
  'keywords' | 'regions' | 'workingGroups' | 'projects'
>;

interface Value {
  readonly label: string;
  readonly typeOfFilter: keyof FiltersType;
  readonly id: string;
}

interface FilterPillProps {
  readonly value: Value;
  onRemove: (value: Value) => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ value, onRemove }) => (
  <div css={pillStyles}>
    {value.label}
    <button css={iconStyles} onClick={() => onRemove(value)}>
      {crossSmallIcon}
    </button>
  </div>
);

export default FilterPill;
