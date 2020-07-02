import React from 'react';
import css from '@emotion/css';

import { fern, pine, silver, mint } from '../colors';

const containerStyle = css({
  borderRadius: '50%',
  boxSizing: 'border-box',
  display: 'flex',
  height: '48px',
  width: '48px',
});

const innerContainerStyle = css({
  alignItems: 'center',
  backgroundColor: mint.rgb,
  borderRadius: '50%',
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
});

const borderStyle = css({
  padding: '4px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: silver.rgb,
});

const initialsStyle = css({
  color: pine.rgb,
});

type ButtonProps = {
  readonly border?: boolean;
  readonly highlight?: boolean;
  readonly initials: string;
};

const Avatar: React.FC<ButtonProps> = ({ border, initials }) => (
  <div css={[border && borderStyle, containerStyle, { borderColor: fern.rgb }]}>
    <div css={[innerContainerStyle]}>
      <p css={[initialsStyle]}>{initials}</p>
    </div>
  </div>
);

export default Avatar;
