import React from 'react';
import css from '@emotion/css';
import { Link } from '../atoms';
import { silver } from '../colors';
import { asapImage } from '../images';
import { ceruleanFernGradientStyles } from '../appearance';

const containerStyles = css({
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
});

const coloredLineStyles = css({
  height: '6px',
});

const imageContainerStyle = css({
  height: '32px',
  paddingTop: '6px',
  marginTop: '24px',
  marginBottom: '24px',
});

const contentContainerStyles = css({
  marginTop: '72px',
  marginBottom: '72px',
});

const footerContainerStyles = css({
  backgroundColor: silver.rgb,
  paddingTop: '12px',
  paddingBottom: '12px',
});

const footerContentContainerStyles = css({
  display: 'flex',
  gridGap: '16px',

  margin: silver.rgb,
});

interface LayoutProps {
  readonly termsHref: string;
  readonly privacyPolicyHref: string;
}

const EmailLayout: React.FC<LayoutProps> = ({
  children,
  termsHref,
  privacyPolicyHref,
}) => (
  <>
    <div css={containerStyles}>
      <div
        role="presentation"
        css={[ceruleanFernGradientStyles, coloredLineStyles]}
      />
      <div
        css={css({
          paddingLeft: '24px',
        })}
      >
        <img alt="ASAP Hub logo" css={imageContainerStyle} src={asapImage} />
        <div css={contentContainerStyles}>{children}</div>
      </div>
    </div>
    <div css={footerContainerStyles}>
      <ul css={[containerStyles, footerContentContainerStyles]}>
        <Link href={privacyPolicyHref}>Privacy policy</Link>
        <Link href={termsHref}>Terms and conditions</Link>
      </ul>
    </div>
  </>
);

export default EmailLayout;
