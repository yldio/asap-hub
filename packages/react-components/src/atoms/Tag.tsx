import React from 'react';
import css from '@emotion/css';
import { steel, mint } from '../colors';
import { perRem } from '../pixels';

const borderWidth = 1;
const containerStyles = css({
  display: 'flex',
  cursor: 'default',
  justifyContent: 'center',
  alignItems: 'center',

  marginTop: `${12 / perRem}em`,
  marginBottom: `${6 / perRem}em`,
});

const styles = css({
  padding: `${7 / perRem}em ${15 / perRem}em ${5 / perRem}em`,

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: `${18 / perRem}em`,
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
