import React from 'react';
import css from '@emotion/css';

import { pine, silver, mint } from '../colors';
import { perRem } from '../pixels';
import { headlineStyles } from '../text';

const ringStyle = css({
  boxSizing: 'border-box',
  height: `${84 / perRem}em`,
  width: `${84 / perRem}em`,

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
  width: '100%',
  height: '100%',
  margin: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  backgroundColor: mint.rgb,
  borderRadius: '50%',
});
const imageStyle = css({
  objectFit: 'contain',
});
const initialsStyle = css(
  {
    color: pine.rgb,
  },
  headlineStyles[2],
);

type ButtonProps = {
  readonly imageUrl?: string;
  readonly firstName?: string;
  readonly lastName?: string;

  readonly border?: boolean;
};

const Avatar: React.FC<ButtonProps> = ({
  imageUrl,
  firstName = '',
  lastName = '',

  border = false,
}) => {
  const name = `${firstName}${firstName && lastName ? ' ' : ''}${lastName}`;
  const initials = (firstName?.[0] ?? '') + (lastName?.[0] ?? '');

  return (
    <div css={[ringStyle, border && ringBorderStyle]}>
      {imageUrl ? (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          alt={`Profile picture${name ? ` of ${name}` : ''}`}
          src={imageUrl}
          css={[circleStyle, imageStyle]}
        />
      ) : (
        <p css={[circleStyle, initialsStyle]}>{initials}</p>
      )}
    </div>
  );
};

export default Avatar;
