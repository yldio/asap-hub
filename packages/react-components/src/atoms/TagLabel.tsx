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

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: `${6 / perRem}em`,

  fontSize: '0.8em',
  color: lead.rgb,
  backgroundColor: paper.rgb,
});

type TagLabelProps = {
  readonly children?: React.ReactNode;
};

const Tag: React.FC<TagLabelProps> = ({ children }) => (
  <span css={styles}>{children}</span>
);

export default Tag;
