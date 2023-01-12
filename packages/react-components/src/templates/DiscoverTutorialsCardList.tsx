import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { NewsSection, HelpSection } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${57 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

type DiscoverTutorialsCardListProps = {
  title: string;
  subtitle: string;
  news: ComponentProps<typeof NewsSection>['news'];
};

const DiscoverTutorialsCardList: React.FC<DiscoverTutorialsCardListProps> = ({
  title,
  subtitle,
  news,
}) => (
  <div css={styles}>
    <NewsSection
      type="Tutorial"
      title={title}
      subtitle={subtitle}
      news={news}
    />
    <HelpSection />
  </div>
);

export default DiscoverTutorialsCardList;
