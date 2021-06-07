import { css } from '@emotion/react';
import { steel, lead, paper } from '../colors';
import { lineHeight, perRem } from '../pixels';

const borderWidth = 1;
const styles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  height: lineHeight,
  margin: `${12 / perRem}em 0`,
  padding: `0 ${8 / perRem}em`,

  maxWidth: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  backgroundColor: paper.rgb,
  color: lead.rgb,

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: `${6 / perRem}em`,
});

type PillProps = {
  readonly children?: React.ReactNode;
};

const Pill: React.FC<PillProps> = ({ children }) => (
  <span css={styles}>
    <small>{children}</small>
  </span>
);

export default Pill;
