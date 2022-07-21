import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { NewsSection, HelpSection } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${57 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

type DiscoverWorkingGroupsProps = {
  training: ComponentProps<typeof NewsSection>['news'];
};

const DiscoverWorkingGroups: React.FC<DiscoverWorkingGroupsProps> = ({ training }) => (
  <div css={styles}>
    <NewsSection
      title="Working Groups"
      subtitle="Explore our Working Groups to learn more about what they are doing."
      news={training.map((item) => ({ ...item, noPill: true }))}
    />
    <HelpSection />
  </div>
);

export default DiscoverWorkingGroups;
