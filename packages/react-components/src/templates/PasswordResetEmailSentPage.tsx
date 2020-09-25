import React from 'react';
import css from '@emotion/css';

import { contentSidePaddingWithoutNavigation } from '../layout';
import { Card, Display, Link, Paragraph } from '../atoms';
import {
  largeDesktopScreen,
  vminLinearCalc,
  tabletScreen,
  perRem,
} from '../pixels';
import { validTickIcon } from '../icons';
import { paper } from '../colors';
import { gradientStyles } from '../appearance';
import { paddingStyles } from '../card';

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

const bannerStyles = css(gradientStyles, {
  height: `${36 / perRem}em`,
  padding: `${24 / perRem}em 0`,

  display: 'flex',
  flexDirection: 'column',

  svg: { stroke: paper.rgb, fill: paper.rgb },
});

const contentStyles = css({
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,

  textAlign: 'center',
});

interface PasswordResetEmailSentPageProps {
  signInHref: string;
}
const PasswordResetEmailSentPage: React.FC<PasswordResetEmailSentPageProps> = ({
  signInHref,
}) => (
  <div css={layoutStyles}>
    <Card padding={false}>
      <div role="presentation" css={bannerStyles}>
        {validTickIcon}
      </div>
      <div css={[paddingStyles, contentStyles]}>
        <Display styleAsHeading={2}>Email sent!</Display>
        <Paragraph primary accent="lead">
          Check your inbox for an email link
        </Paragraph>
        <Link href={signInHref} buttonStyle primary>
          Back to sign in
        </Link>
      </div>
    </Card>
  </div>
);

export default PasswordResetEmailSentPage;
