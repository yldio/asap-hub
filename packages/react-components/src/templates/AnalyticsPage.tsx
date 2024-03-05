import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import AnalyticsPageHeader from './AnalyticsPageHeader';
import { defaultPageLayoutPaddingStyle } from '../layout';

const mainStyles = css({
  padding: defaultPageLayoutPaddingStyle,
});

type AnalyticsPageProps = ComponentProps<typeof AnalyticsPageHeader>;

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ children }) => (
  <article>
    <AnalyticsPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default AnalyticsPage;
