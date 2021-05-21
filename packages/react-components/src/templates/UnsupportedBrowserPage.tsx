import { css } from '@emotion/react';

import { BannerCard } from '../molecules';
import { Display, Paragraph, Link } from '../atoms';
import { perRem } from '../pixels';
import { contentSidePaddingWithoutNavigation } from '../layout';

const styles = css({
  height: '100%',
  padding: `${24 / perRem}em ${contentSidePaddingWithoutNavigation()}`,
  maxWidth: `${480 / perRem}em`,

  display: 'grid',
  alignItems: 'center',
});

const UnsupportedBrowserPage: React.FC<Record<string, never>> = () => (
  <div css={styles}>
    <BannerCard type="warning">
      <Display styleAsHeading={2}>Browser not supported</Display>
      <Paragraph primary accent="lead">
        The ASAP Hub is not available on the browser you are using. To visit the
        ASAP Hub please use a supported browser (such as{' '}
        <Link href="https://www.google.com/chrome/">Google Chrome</Link>,{' '}
        <Link href="https://www.apple.com/safari/">Safari</Link>,{' '}
        <Link href="https://www.microsoft.com/edge">Edge</Link> or{' '}
        <Link href="https://www.mozilla.org/firefox">Firefox</Link>) and update
        your browser if it is out of date.
      </Paragraph>
    </BannerCard>
  </div>
);

export default UnsupportedBrowserPage;
