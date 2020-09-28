import React from 'react';
import css from '@emotion/css';
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
  paddingTop: `${1 / perRem}em`,
  paddingLeft: `${8 / perRem}em`,
  paddingRight: `${8 / perRem}em`,

  color: lead.rgb,
  fontSize: '0.8em',

  marginTop: `${6 / perRem}em`,
  marginBottom: `${6 / perRem}em`,
});

type TagLabelProps = {
  readonly children?: React.ReactNode;
};

const Tag: React.FC<TagLabelProps> = ({ children }) => (
  <div css={[styles]}>{children}</div>
);

export default Tag;
