import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { Headline2, Paragraph } from '../atoms';
import { HelpSection, TutorialCard } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${57 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

type DiscoverTutorialsCardListProps = {
  title: string;
  subtitle: string;
  tutorials: ReadonlyArray<
    Omit<ComponentProps<typeof TutorialCard>, 'children'>
  >;
};

const DiscoverTutorialsCardList: React.FC<DiscoverTutorialsCardListProps> = ({
  title,
  subtitle,
  tutorials,
}) => (
  <div css={styles}>
    <section>
      <Headline2 styleAsHeading={3}>{title}</Headline2>
      {subtitle && <Paragraph accent="lead">{subtitle}</Paragraph>}
      <div css={styles}>
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} {...tutorial} />
        ))}
      </div>
    </section>
    <HelpSection />
  </div>
);

export default DiscoverTutorialsCardList;
