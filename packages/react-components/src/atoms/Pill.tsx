import { css, SerializedStyles } from '@emotion/react';
import { Ellipsis } from '.';
import { steel, lead, paper } from '../colors';
import { lineHeight, perRem } from '../pixels';

const borderWidth = 1;
const styles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  height: lineHeight,
  margin: `${12 / perRem}em 0`,
  padding: `0 ${8 / perRem}em`,

  backgroundColor: paper.rgb,
  color: lead.rgb,

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: `${6 / perRem}em`,
});

type PillProps = {
  readonly children?: React.ReactNode;
  readonly overrideStyles?: SerializedStyles;
};

const Pill: React.FC<PillProps> = ({ children, overrideStyles }) => (
  <span css={[styles, overrideStyles]}>
    <Ellipsis>
      <small>{children}</small>
    </Ellipsis>
  </span>
);

export default Pill;
