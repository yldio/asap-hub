import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import AnalyticsPageHeader from './AnalyticsPageHeader';
import AnalyticsMobilePage from './AnalyticsMobilePage';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { mobileScreen } from '../pixels';

const mainStyles = css({
  padding: defaultPageLayoutPaddingStyle,
});

const pageMobileStyles = css({
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'none',
  },
});
const pageDesktopStyles = css({
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    display: 'none',
  },
});

type AnalyticsPageProps = ComponentProps<typeof AnalyticsPageHeader>;

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  children,
  onExportAnalytics,
}) => (
  <article>
    <div css={pageDesktopStyles}>
      <AnalyticsPageHeader onExportAnalytics={onExportAnalytics} />
      <main css={mainStyles}>{children}</main>
    </div>
    <div css={pageMobileStyles}>
      <AnalyticsMobilePage />
    </div>
  </article>
);

export default AnalyticsPage;
