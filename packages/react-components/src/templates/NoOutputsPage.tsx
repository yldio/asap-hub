import { css } from '@emotion/react';
import { sharedResearch } from '@asap-hub/routing';
import { ReactNode } from 'react';

import { Display, Paragraph, Link } from '../atoms';
import { vminLinearCalc, mobileScreen, largeDesktopScreen } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { libraryIcon } from '../icons';
import { charcoal } from '../colors';

const styles = css({
  padding: `${vminLinearCalc(
    mobileScreen,
    36,
    largeDesktopScreen,
    72,
    'px',
  )} ${contentSidePaddingWithNavigation()}`,

  display: 'grid',
  textAlign: 'center',

  [`@media (min-width: ${mobileScreen.width + 1}px)`]: {
    justifyItems: 'center',
  },
});
const iconStyles = css({
  svg: { stroke: charcoal.rgb, width: 48, height: 48 },
});

type NoOutputsPageProps = {
  title: string;
  description: ReactNode;
  hideExploreButton?: boolean;
};

const NoOutputsPage: React.FC<NoOutputsPageProps> = ({
  title,
  description,
  hideExploreButton = false,
}) => (
  <div css={styles}>
    <span css={iconStyles}>{libraryIcon}</span>
    <div>
      <Display styleAsHeading={3}>{title}</Display>
      <Paragraph accent="lead">{description}</Paragraph>
    </div>
    {!hideExploreButton && (
      <Link buttonStyle primary href={sharedResearch({}).$}>
        Explore Shared Research
      </Link>
    )}
  </div>
);

export default NoOutputsPage;
