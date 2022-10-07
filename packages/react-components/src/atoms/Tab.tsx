import { ReactNode } from 'react';
import { css } from '@emotion/react';
// should be renamed tabButton
import { layoutStyles } from '../text';
import { perRem } from '../pixels';
import { fern, lead, charcoal } from '../colors';

const styles = css({
  display: 'inline-block',
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${12 / perRem}em`,

  color: lead.rgb,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
});

const activeStyles = css({
  paddingBottom: `${(12 - 4) / perRem}em`,
  borderBottom: `solid ${4 / perRem}em ${fern.rgb}`,

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
interface TabProps {
  readonly children: ReactNode;
  active?: boolean;
  disabled?: boolean;
}
const Tab: React.FC<TabProps> = ({ children, active, disabled }) => (
  <button css={[resetButtonStyles, styles, active && activeStyles, disabled && disabledStyles]}>
    <p css={layoutStyles}>{children}</p>
  </button>
);

export default Tab;
