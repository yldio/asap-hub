import React from 'react';
import css from '@emotion/css';

import { pine, silver, mint } from '../colors';
import { perRem } from '../pixels';

const ringStyle = css({
  display: 'flex',
  height: `${86 / perRem}em`,
  width: `${86 / perRem}em`,

  margin: `${12 / perRem}em 0`,
});
const ringBorderStyle = css({
  padding: `${4 / perRem}em`,

  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '50%',
  borderColor: silver.rgb,
});

const circleStyle = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  backgroundColor: mint.rgb,
  borderRadius: '50%',
});

const initialsStyle = css({
  paddingTop: `${2 / perRem}em`,
  color: pine.rgb,
});

type ButtonProps = {
  readonly border?: boolean;

  readonly firstName?: string;
  readonly lastName?: string;
};

const Avatar: React.FC<ButtonProps> = ({
  border = false,
  firstName,
  lastName,
}) => {
  const initials = (firstName?.[0] ?? '') + (lastName?.[0] ?? '');

  return (
    <div css={[ringStyle, border && ringBorderStyle]}>
      <div css={[circleStyle]}>
        <p css={[initialsStyle]}>{initials}</p>
      </div>
    </div>
  );
};

export default Avatar;
