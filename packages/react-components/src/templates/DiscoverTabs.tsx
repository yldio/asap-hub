import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { NewsSection, HelpSection } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${57 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

type DiscoverTabsProps =
  | {
      training: ComponentProps<typeof NewsSection>['news'];
      workingGroups?: never;
    }
  | {
      training?: never;
      workingGroups: ComponentProps<typeof NewsSection>['news'];
    };

export const getTitle = (props: DiscoverTabsProps): string => {
  if (props.training) {
    return 'Tutorials';
  }
  return 'Working Groups';
};

export const getSubtitle = (props: DiscoverTabsProps): string => {
  if (props.training) {
    return 'Explore our tutorials to understand how you can use the Hub and work with the tools.';
  }
  return 'Explore our Working Groups to learn more about what they are doing.';
};

const getNews = (props: DiscoverTabsProps) => {
  if (props.training) {
    return props.training.map((item) => ({ ...item, noPill: true }));
  }
  return props.workingGroups.map((item) => ({ ...item, noPill: true }));
};

const DiscoverTabs: React.FC<DiscoverTabsProps> = (props) => (
  <div css={styles}>
    <NewsSection
      title={getTitle(props)}
      subtitle={getSubtitle(props)}
      news={getNews(props)}
    />
    <HelpSection />
  </div>
);

export default DiscoverTabs;
