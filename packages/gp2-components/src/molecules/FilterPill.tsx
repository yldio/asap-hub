import { css } from '@emotion/react';
import { borderWidth, crossSmallIcon } from '@asap-hub/react-components';
import colors from '../templates/colors';

const pillStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
  height: '22px',
  padding: `8px 12px`,
  gap: '8px',
  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderRadius: '24px',
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

export interface ValueProps {
  readonly label: string;
  readonly id: string;
}

interface PillProps {
  readonly value: ValueProps;
  onRemove: (value: ValueProps) => void;
}

const FilterPill: React.FC<PillProps> = ({ value, onRemove }) => (
  <div css={pillStyles}>
    <div>{value.label}</div>
    <button css={iconStyles} onClick={() => onRemove(value)}>
      {crossSmallIcon}
    </button>
  </div>
);

export default FilterPill;
