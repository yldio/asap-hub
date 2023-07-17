import { css } from '@emotion/react';
import { perRem } from '../pixels';

const imageStyle = (imageUrl: string) =>
  css({
    backgroundImage: `url(${JSON.stringify(imageUrl)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: `${24 / perRem}em`,
    height: `${24 / perRem}em`,
  });

interface IconProps {
  readonly url: string;
}
const Icon: React.FC<IconProps> = ({ url }) => {
  const iconStyle = imageStyle(url);
  return <div css={iconStyle}></div>;
};

export default Icon;
