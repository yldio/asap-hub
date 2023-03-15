import {
  contentSidePaddingWithNavigation,
  Display,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ReactChild } from 'react';

const { largeDesktopScreen, mobileScreen, vminLinearCalc } = pixels;

interface EmptyStateProps {
  icon: ReactChild;
  title: string;
  description: string;
}

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
});

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
}) => (
  <div css={styles}>
    <span>{icon}</span>
    <div>
      <Display styleAsHeading={3}>{title}</Display>
      <Paragraph accent="lead">{description}</Paragraph>
    </div>
  </div>
);

export default EmptyState;
