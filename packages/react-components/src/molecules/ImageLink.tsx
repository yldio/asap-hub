import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { fern } from '../colors';

interface ImageLinkProps {
  imgSrc?: string;
  link?: string;
  alt?: string;
  placeholder?: EmotionJSX.Element;
  containerPropStyle?: React.CSSProperties;
}

const ImageLink: React.FC<ImageLinkProps> = ({
  imgSrc,
  link,
  alt,
  placeholder,
  containerPropStyle,
}) => {
  const wrapperStyle = link
    ? {
        ...containerPropStyle,
        ...{
          transition: ' 100ms ease-in-out, color 100ms ease-in-out',
          ':hover': {
            color: fern,
            opacity: '64%',
          },
        },
      }
    : containerPropStyle;

  return (
    <a css={wrapperStyle} href={link}>
      {imgSrc ? <img src={imgSrc} alt={alt} /> : <div>{placeholder}</div>}
    </a>
  );
};

export default ImageLink;
