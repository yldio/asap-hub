import {
  borderWidth,
  crossSmallIcon,
  pixels,
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

type FilterPillProps = {
  readonly children?: React.ReactNode;
  onRemove: () => void;
};

const FilterPill: React.FC<FilterPillProps> = ({ children, onRemove }) => (
  <div css={pillStyles}>
    {children}
    <button css={iconStyles} onClick={onRemove}>
      {crossSmallIcon}
    </button>
  </div>
);

export default FilterPill;
