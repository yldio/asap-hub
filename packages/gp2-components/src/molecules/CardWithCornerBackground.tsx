import { Card, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { projectsImage } from '../images';

type CardWithCornerBackgroundProps = ComponentProps<typeof Card>;

const { rem } = pixels;

const containerStyles = css({
  display: 'grid',
  gridTemplateRows: '52px 1fr 22px',
  gridTemplateColumns: '58px 1fr 28px',
  margin: '12px 0',
});

const backgroundStyle = css({
  gridArea: '2 / 2 / 4 / 4',
  order: -1,
  backgroundImage: `url(${projectsImage})`,
  borderRadius: rem(8),
});

const contentCardStyle = css({
  gridArea: '1 / 3 / 3 / 1',
});

const CardWithCornerBackground: React.FC<CardWithCornerBackgroundProps> = ({
  children,
}) => (
  <div css={containerStyles}>
    <div css={contentCardStyle}>
      <Card shadow={false} accent="default">
        {children}
      </Card>
    </div>
    <div css={backgroundStyle}></div>
  </div>
);

export default CardWithCornerBackground;
