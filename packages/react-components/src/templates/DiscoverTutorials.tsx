import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { NewsSection, HelpSection } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${57 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

type DiscoverTutorialsProps = {
  training: ComponentProps<typeof NewsSection>['news'];
};

const DiscoverTutorials: React.FC<DiscoverTutorialsProps> = ({ training }) => (
  <div css={styles}>
    <NewsSection
      title="Tutorials"
      subtitle="Explore our tutorials to understand how you can use the Hub and work with the tools."
      news={training.map((item) => ({ ...item, type: 'Tutorial' }))}
    />
    <HelpSection />
  </div>
);

export default DiscoverTutorials;
