import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { Headline2, Paragraph } from '../atoms';
import { SearchField } from '../molecules';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${57 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

type TutorialsPageHeaderProps = {
  searchQuery: ComponentProps<typeof SearchField>['value'];
  onSearchQueryChange: ComponentProps<typeof SearchField>['onChange'];
};

const TutorialsPageHeader: React.FC<TutorialsPageHeaderProps> = ({
  onSearchQueryChange,
  searchQuery,
}) => (
  <div css={styles}>
    <section>
      <Headline2 styleAsHeading={3}>Tutorials</Headline2>
      <Paragraph accent="lead">
        Explore our tutorials to understand how you can use the Hub and work
        with the tools.
      </Paragraph>
      <SearchField
        placeholder="Enter a tutorial name, keyword, team name…"
        value={searchQuery}
        onChange={onSearchQueryChange}
      />
    </section>
  </div>
);

export default TutorialsPageHeader;
