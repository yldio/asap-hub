import { css } from '@emotion/react';

import { rem, smallDesktopScreen } from '../pixels';
import { Card } from '../atoms';

const cardStyles = css({ marginBottom: rem(32) });
const containerPadding = rem(24);

const containerStyles = css({
  padding: containerPadding,
  display: 'grid',
  [`@media (max-width: calc(${smallDesktopScreen.width}px + ${containerPadding}))`]:
    {
      gridTemplateColumns: '1fr',
    },
  gridTemplateColumns: '1fr 1fr',
  rowGap: rem(16),
  columnGap: rem(16),
});

interface CaptionCardProps {
  children: React.ReactNode;
}
const CaptionCard: React.FC<CaptionCardProps> = ({ children }) => (
  <Card padding={false} overrideStyles={cardStyles}>
    <div css={containerStyles}>{children}</div>
  </Card>
);
export default CaptionCard;
