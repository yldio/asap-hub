import {
  ceruleanFernGradientStyles,
  Link,
  pixels,
  silver,
} from '@asap-hub/react-components';
import { staticPages } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { gp2Image } from '../images';

const { perRem } = pixels;

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
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  '*': { paddingRight: `${12 / perRem}em` },
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
        <img alt="GP2 Hub logo" css={imageContainerStyle} src={gp2Image} />
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
