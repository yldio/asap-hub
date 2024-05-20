import { Card, pixels } from '@asap-hub/react-components';

import { css } from '@emotion/react';
import colors from '../templates/colors';

type CardWithBackgroundProps = {
  image: string;
};
const { rem } = pixels;

const containerStyles = (image: string) =>
  css({
    backgroundImage: `url(${image})`,
    borderRadius: rem(8),
    backgroundSize: 'cover',
    padding: rem(16),
    border: `1px solid ${colors.neutral500.rgb}`,
    filter: `drop-shadow(0px 2px 4px ${colors.neutral500.rgb})`,
  });

const CardWithBackground: React.FC<React.PropsWithChildren<CardWithBackgroundProps>> = ({
  image,
  children,
}) => (
  <div css={containerStyles(image)}>
    <Card>{children}</Card>
  </div>
);

export default CardWithBackground;
