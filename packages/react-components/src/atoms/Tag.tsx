import React from 'react';
import css from '@emotion/css';
import { steel, charcoal, mint } from '../colors';
import { tabletScreen } from '../pixels';

const borderWidth = 1;
const containerStyles = css({
  display: 'flex',
  cursor: 'default',
  justifyContent: 'center',
  alignItems: 'center',

  marginTop: '6px',
  marginBottom: '6px',

  [`@media (min-width: ${tabletScreen.width}px)`]: {
    marginTop: '12px',
  },
});

const styles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: '18px',

  height: '36px',
  transition: '200ms',
  paddingLeft: '12px',
  paddingRight: '12px',

  ':hover': {
    borderColor: charcoal.rgb,
  },
});

const highlightStyles = css({
  backgroundColor: mint.rgb,
});

type TagProps = {
  readonly highlight?: boolean;
  readonly children?: React.ReactNode;
};

const Tag: React.FC<TagProps> = ({ children, highlight = false }) => (
  <div css={containerStyles}>
    <div css={[styles, highlight && highlightStyles]}>{children}</div>
  </div>
);

export default Tag;
