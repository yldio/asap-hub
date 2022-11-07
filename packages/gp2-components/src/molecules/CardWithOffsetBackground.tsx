import { Card, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { workingGroupsImage } from '../images';

type CardWithOffsetBackgroundProps = Omit<
  ComponentProps<typeof Card>,
  'shadow'
>;

const { rem } = pixels;

const containerStyles = css({
  display: 'grid',
  gridTemplateRows: `${rem(52)} 1fr ${rem(22)}`,
  gridTemplateColumns: `${rem(58)} 1fr ${rem(28)}`,
  margin: `${rem(12)} 0`,
});

const backgroundStyle = css({
  gridArea: '2 / 2 / 4 / 4',
  backgroundImage: `url(${workingGroupsImage})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: rem(8),
});

const contentCardStyle = css({
  gridArea: '1 / 3 / 3 / 1',
});

const CardWithOffsetBackground: React.FC<CardWithOffsetBackgroundProps> = ({
  children,
  ...props
}) => (
  <div css={containerStyles}>
    <div css={backgroundStyle}></div>
    <div css={contentCardStyle}>
      <Card shadow={false} {...props}>
        {children}
      </Card>
    </div>
  </div>
);

export default CardWithOffsetBackground;
