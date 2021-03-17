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
  charcoal,
  paper,
} from '../colors';
import { perRem } from '../pixels';
import { headlineStyles, fontStyles } from '../text';

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

const minWidth = 36;
const maxWidth = 90;

const borderPadding = 4;
const borderWidth = 1;

const ringStyle = css({
  boxSizing: 'border-box',
  minWidth: `${minWidth / perRem}em`,
  width: `min(100%, ${maxWidth / perRem}em)`,

  // margin only for Avatars that get all the space (max) they want
  margin: `clamp(0px, calc(100% - ${maxWidth - 12}px), 12px) 0`,
});

const ringBorderStyle = css({
  padding: `${borderPadding / perRem}em`,

  borderWidth,
  borderStyle: 'solid',
  borderRadius: '50%',
  borderColor: silver.rgb,
});
const placeholderStyle = css({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '50%',
  borderColor: charcoal.rgb,
});

const circleStyle = css({
  margin: 0,
  borderRadius: '50%',
});

const imageStyle = (imageUrl: string) =>
  css({
    backgroundImage: `url(${JSON.stringify(imageUrl)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  });

const initialsStyle = css({
  display: 'grid',
  justifyContent: 'stretch',
  alignContent: 'stretch',
});
const textStyle = css(fontStyles, headlineStyles[3], {
  dominantBaseline: 'central',
  textAnchor: 'middle',
  fontSize: '1.42em',
});

const placeholderColorStyle = css({
  backgroundColor: paper.rgb,
  fill: charcoal.rgb,
});
const colorStyles = [
  css({ backgroundColor: mint.rgb, fill: pine.rgb }),
  css({ backgroundColor: apricot.rgb, fill: clay.rgb }),
  css({ backgroundColor: sky.rgb, fill: denim.rgb }),
  css({ backgroundColor: azure.rgb, fill: space.rgb }),
  css({ backgroundColor: lilac.rgb, fill: berry.rgb }),
  css({ backgroundColor: lavender.rgb, fill: mauve.rgb }),
];

type RegularAvatarProps = {
  readonly imageUrl?: string;
  readonly firstName?: string;
  readonly lastName?: string;

  readonly placeholder?: undefined;
};
type PlaceholderAvatarProps = {
  readonly imageUrl?: undefined;
  readonly firstName?: undefined;
  readonly lastName?: undefined;

  readonly placeholder?: string;
};
type AvatarProps = (RegularAvatarProps | PlaceholderAvatarProps) & {
  readonly border?: boolean;
};

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  firstName = '',
  lastName = '',
  placeholder = '',
  border = false,
}) => {
  const name = `${firstName}${firstName && lastName ? ' ' : ''}${lastName}`;
  const initials = (firstName?.[0] ?? '') + (lastName?.[0] ?? '');

  return (
    <div
      css={[
        ringStyle,
        border && ringBorderStyle,
        placeholder && placeholderStyle,
      ]}
    >
      <p
        role="img"
        aria-label={`Profile picture${
          placeholder
            ? ` placeholder: ${placeholder}`
            : name
            ? ` of ${name}`
            : ''
        }`}
        css={[
          circleStyle,
          initialsStyle,
          placeholder
            ? placeholderColorStyle
            : imageUrl
            ? null
            : colorStyles[hash(initials) % colorStyles.length],
          imageUrl && imageStyle(imageUrl),
        ]}
      >
        <svg viewBox="0 0 90 90" css={imageUrl && { visibility: 'hidden' }}>
          <text x="50%" y="50%" css={textStyle}>
            {placeholder || initials}
          </text>
        </svg>
      </p>
    </div>
  );
};

export default Avatar;
