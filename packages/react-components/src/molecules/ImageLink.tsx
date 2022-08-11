import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { css, SerializedStyles } from '@emotion/react';
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
  link?: string;
  alt?: string;
  placeholder?: EmotionJSX.Element;
  containerPropStyle?: SerializedStyles;
}

const ImageLink: React.FC<ImageLinkProps> = ({
  imgSrc,
  link,
  alt,
  placeholder,
  containerPropStyle,
}) => (
  <Anchor css={[containerPropStyle, link && hoverStyle]} href={link}>
    {imgSrc ? <img src={imgSrc} alt={alt} /> : <>{placeholder}</>}
  </Anchor>
);

export default ImageLink;
