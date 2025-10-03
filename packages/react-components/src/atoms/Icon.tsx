import { css } from '@emotion/react';
import { rem } from '../pixels';

export const imageStyle = (imageUrl: string) =>
  css({
    backgroundImage: `url(${JSON.stringify(imageUrl)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: rem(24),
    height: rem(24),
  });

interface IconProps {
  readonly url: string;
}
const Icon: React.FC<IconProps> = ({ url }) => {
  const iconStyle = imageStyle(url);
  return <div css={iconStyle}></div>;
};

export default Icon;
