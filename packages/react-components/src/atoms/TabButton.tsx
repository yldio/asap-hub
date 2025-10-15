import { ReactNode } from 'react';
import { css } from '@emotion/react';
import { layoutStyles } from '../text';
import { rem } from '../pixels';
import { fern, lead, charcoal } from '../colors';

const styles = css({
  display: 'inline-block',
  paddingTop: rem(12),
  paddingBottom: rem(12),

  color: lead.rgb,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
});

const activeStyles = css({
  paddingBottom: rem(12 - 4),
  borderBottom: `solid ${rem(4)} ${fern.rgb}`,

  color: charcoal.rgb,
  cursor: 'default',
  fontWeight: 'bold',
});

const disabledStyles = css({
  cursor: 'unset',
});

const resetButtonStyles = css({
  appearance: 'none',
  border: 'none',
  background: 'none',

  padding: 0,
  margin: 0,
});
interface TabButtonProps {
  readonly children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({
  children,
  active,
  disabled,
  onClick,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    css={[
      resetButtonStyles,
      styles,
      active && activeStyles,
      disabled && disabledStyles,
    ]}
  >
    <p css={layoutStyles}>{children}</p>
  </button>
);

export default TabButton;
