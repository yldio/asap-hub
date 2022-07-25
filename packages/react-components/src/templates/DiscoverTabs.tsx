import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { NewsSection, HelpSection } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${57 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

type DiscoverTabsProps = {
  title: string;
  subtitle: string;
  news: ComponentProps<typeof NewsSection>['news'];
};

const DiscoverTabs: React.FC<DiscoverTabsProps> = ({
  title,
  subtitle,
  news,
}) => (
  <div css={styles}>
    <NewsSection
      title={title}
      subtitle={subtitle}
      news={news.map((item) => ({ ...item, noPill: true }))}
    />
    <HelpSection />
  </div>
);

export default DiscoverTabs;
