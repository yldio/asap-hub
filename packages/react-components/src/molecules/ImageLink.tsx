import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { css } from '@emotion/react';
import { Anchor } from '../atoms';
import { fern } from '../colors';

const hoverStyle = css({
  transition: `100ms ease-in-out, color 100ms ease-in-out`,
  ':hover': {
    color: fern.rgb,
    opacity: '64%',
  },
});

interface ImageLinkProps {
  imgSrc?: string;
  link: string;
  alt?: string;
  placeholder?: EmotionJSX.Element;
}

const ImageLink: React.FC<ImageLinkProps> = ({
  imgSrc,
  link,
  alt,
  placeholder,
}) => (
  <Anchor css={hoverStyle} href={link}>
    {imgSrc ? <img src={imgSrc} alt={alt} /> : <div>{placeholder}</div>}
  </Anchor>
);

export default ImageLink;
