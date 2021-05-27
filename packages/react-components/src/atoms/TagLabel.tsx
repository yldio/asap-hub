import { css } from '@emotion/react';
import { steel, lead, paper } from '../colors';
import { perRem } from '../pixels';

const borderWidth = 1;
const styles = css({
  display: 'inline-block',
  backgroundColor: paper.rgb,

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: `${6 / perRem}em`,

  transition: '200ms',
  padding: `0 ${8 / perRem}em`,
  height: '24px',
  boxSizing: 'border-box',

  color: lead.rgb,
  fontSize: '0.8em',

  margin: `${12 / perRem}em 0`,
});

const ellipsisStyles = css({
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

type TagLabelProps = {
  readonly children?: React.ReactNode;
};

const Tag: React.FC<TagLabelProps> = ({ children }) => (
  <div css={styles}>
    <span css={ellipsisStyles}>{children}</span>
  </div>
);

export default Tag;
