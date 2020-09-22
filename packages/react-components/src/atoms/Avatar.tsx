import React from 'react';
import css from '@emotion/css';

import {
  pine,
  silver,
  mint,
  apricot,
  clay,
  sky,
  denim,
  azure,
  space,
  lilac,
  berry,
  lavender,
  mauve,
} from '../colors';
import { perRem } from '../pixels';
import { headlineStyles } from '../text';

const hash = (str: string) => {
  let h = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    h = (h << 5) - h + chr; // eslint-disable-line no-bitwise
    h |= 0; // eslint-disable-line no-bitwise
  }
  return h;
};

const ringStyle = css({
  boxSizing: 'border-box',
  height: `${90 / perRem}em`,
  width: `${90 / perRem}em`,

  margin: `${12 / perRem}em 0`,
});

const smallRingStyle = css({
  boxSizing: 'border-box',
  height: `${48 / perRem}em`,
  width: `${48 / perRem}em`,
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
  borderRadius: '50%',
});
const imageStyle = css({
  objectFit: 'contain',
});

const initialsStyle = css(headlineStyles[3]);
const smallInitialsStyle = css({
  fontWeight: 'bold',
});

type AvatarProps = {
  readonly imageUrl?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly small?: boolean;
  readonly border?: boolean;
};

const colors = [
  css({ backgroundColor: mint.rgb, color: pine.rgb }),
  css({ backgroundColor: apricot.rgb, color: clay.rgb }),
  css({ backgroundColor: sky.rgb, color: denim.rgb }),
  css({ backgroundColor: azure.rgb, color: space.rgb }),
  css({ backgroundColor: lilac.rgb, color: berry.rgb }),
  css({ backgroundColor: lavender.rgb, color: mauve.rgb }),
];

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  firstName = '',
  lastName = '',
  small = false,
  border = false,
}) => {
  const name = `${firstName}${firstName && lastName ? ' ' : ''}${lastName}`;
  const initials = (firstName?.[0] ?? '') + (lastName?.[0] ?? '');

  return (
    <div css={[small ? smallRingStyle : ringStyle, border && ringBorderStyle]}>
      {imageUrl ? (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          alt={`Profile picture${name ? ` of ${name}` : ''}`}
          src={imageUrl}
          css={[circleStyle, imageStyle]}
        />
      ) : (
        <p
          css={[
            circleStyle,
            small ? smallInitialsStyle : initialsStyle,
            colors[hash(initials) % colors.length],
          ]}
        >
          {initials}
        </p>
      )}
    </div>
  );
};

export default Avatar;
