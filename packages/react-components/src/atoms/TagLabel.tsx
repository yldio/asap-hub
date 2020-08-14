import React from 'react';
import css from '@emotion/css';
import { steel, lead } from '../colors';

const borderWidth = 1;
const containerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  marginTop: '6px',
  marginBottom: '6px',
});

const styles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: '6px',

  transition: '200ms',
  paddingLeft: '6px',
  paddingRight: '6px',

  color: lead.rgb,
  fontSize: '0.8em',
});

type TagLabelProps = {
  readonly children?: React.ReactNode;
};

const Tag: React.FC<TagLabelProps> = ({ children }) => (
  <div css={containerStyles}>
    <div css={[styles]}>{children}</div>
  </div>
);

export default Tag;
