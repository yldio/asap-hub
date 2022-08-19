import { Card } from '@asap-hub/react-components';
import { css } from '@emotion/react';

type CardWithBackgroundProps = {
  image: string;
};

const containerStyles = (image: string) =>
  css({
    backgroundImage: `url(${image})`,
    borderRadius: `8px`,
    backgroundSize: '100%',
    padding: '16px',
    border: '1px solid #DFE5EA',
    filter: 'drop-shadow(0px 2px 4px #DFE5EA)',
  });

const CardWithBackground: React.FC<CardWithBackgroundProps> = ({
  image,
  children,
}) => (
  <div css={containerStyles(image)}>
    <Card>{children}</Card>
  </div>
);

export default CardWithBackground;
