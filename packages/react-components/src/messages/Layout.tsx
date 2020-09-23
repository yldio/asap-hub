import React from 'react';
import css from '@emotion/css';
import { Link } from '../atoms';
import { silver } from '../colors';
import { asapImage } from '../images';
import { gradientStyles } from '../appearance';

interface LayoutProps {
  readonly children: React.ReactNode;
}

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
  margin: silver.rgb,
});

const Component: React.FC<LayoutProps> = ({ children }) => (
  <>
    <div css={containerStyles}>
      <div role="presentation" css={[gradientStyles, coloredLineStyles]} />
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
        <Link href="https://hub.asap.science">Privacy policy</Link>
        <Link href="https://hub.asap.science">Terms and conditions</Link>
      </ul>
    </div>
  </>
);

export default Component;
