import { ReactNode } from 'react';
import { css } from '@emotion/react';
import { staticPages } from '@asap-hub/routing';

import { Link } from '../atoms';
import { silver } from '../colors';
import { asapImage } from '../images';
import { ceruleanFernGradientStyles } from '../appearance';
import { perRem } from '../pixels';

const containerStyles = css({
  maxWidth: `${600 / perRem}em`,
  marginLeft: 'auto',
  marginRight: 'auto',
});

const coloredLineStyles = css({
  height: `${6 / perRem}em`,
});

const imageContainerStyle = css({
  height: `${32 / perRem}em`,
  paddingTop: `${6 / perRem}em`,
  marginTop: `${24 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

const contentContainerStyles = css({
  paddingLeft: `${24 / perRem}em`,
  marginTop: `${72 / perRem}em`,
  marginBottom: `${72 / perRem}em`,
});

const footerContainerStyles = css({
  backgroundColor: silver.rgb,
  padding: `${12 / perRem}em`,
});

const footerContentContainerStyles = css({
  display: 'grid',
  gridAutoFlow: 'column',
  justifyContent: 'start',
  columnGap: '16px',
});

interface LayoutProps {
  readonly children: ReactNode;
  readonly appOrigin: string;
}

const MessageLayout: React.FC<LayoutProps> = ({ children, appOrigin }) => (
  <>
    <div css={containerStyles}>
      <div
        role="presentation"
        css={[ceruleanFernGradientStyles, coloredLineStyles]}
      />
      <div css={{ paddingLeft: '24px' }}>
        <img alt="ASAP Hub logo" css={imageContainerStyle} src={asapImage} />
      </div>
      <main css={contentContainerStyles}>{children}</main>
    </div>
    <div css={footerContainerStyles}>
      <ul css={[containerStyles, footerContentContainerStyles]}>
        <Link href={new URL(staticPages({}).terms({}).$, appOrigin).toString()}>
          Privacy policy
        </Link>
        <Link
          href={new URL(
            staticPages({}).privacyPolicy({}).$,
            appOrigin,
          ).toString()}
        >
          Terms and conditions
        </Link>
      </ul>
    </div>
  </>
);

export default MessageLayout;
