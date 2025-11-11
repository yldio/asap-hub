import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import AnalyticsPageHeader from './AnalyticsPageHeader';
import AnalyticsMobilePage from './AnalyticsMobilePage';
import { mobileScreen } from '../pixels';
import PageContraints from './PageConstraints';

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
      <PageContraints as="main">{children}</PageContraints>
    </div>
    <div css={pageMobileStyles}>
      <AnalyticsMobilePage />
    </div>
  </article>
);

export default AnalyticsPage;
