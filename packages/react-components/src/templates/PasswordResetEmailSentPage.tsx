import { css } from '@emotion/react';

import { contentSidePaddingWithoutNavigation } from '../layout';
import { Display, Link, Paragraph } from '../atoms';
import {
  largeDesktopScreen,
  vminLinearCalc,
  tabletScreen,
  perRem,
} from '../pixels';
import { BannerCard } from '../molecules';

const layoutStyles = css({
  flexGrow: 1,
  alignSelf: 'stretch',
  padding: `${24 / perRem}em ${contentSidePaddingWithoutNavigation()}`,

  display: 'grid',
  justifyContent: 'center',
  alignContent: 'center',
  gridTemplateColumns: `min(${vminLinearCalc(
    tabletScreen,
    384,
    largeDesktopScreen,
    415,
    'px',
  )}, 100%)`,
});

interface PasswordResetEmailSentPageProps {
  signInHref: string;
}
const PasswordResetEmailSentPage: React.FC<PasswordResetEmailSentPageProps> = ({
  signInHref,
}) => (
  <div css={layoutStyles}>
    <BannerCard type="success">
      <Display styleAsHeading={2}>Email sent!</Display>
      <Paragraph accent="lead">Check your inbox for an email link</Paragraph>
      <Link href={signInHref} buttonStyle primary>
        Back to sign in
      </Link>
    </BannerCard>
  </div>
);

export default PasswordResetEmailSentPage;
