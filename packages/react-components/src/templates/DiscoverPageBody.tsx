import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import {
  PagesSection,
  RichText,
  TeamMembersSection,
  HelpSection,
  NewsSection,
} from '../organisms';
import { MembersList } from '../molecules';
import { perRem } from '../pixels';
import { Display, Card } from '../atoms';

const styles = css({
  display: 'grid',
  gridRowGap: `${72 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

const aboutUsStyles = css({
  paddingTop: `${24 / perRem}em`,
});

type DashboardPageBodyProps = Omit<
  ComponentProps<typeof PagesSection>,
  'title'
> &
  Omit<ComponentProps<typeof TeamMembersSection>, 'title'> & {
    readonly aboutUs: string;
    readonly training: ComponentProps<typeof NewsSection>['news'];
    readonly scientificAdvisoryBoard: ReadonlyArray<
      Omit<ComponentProps<typeof MembersList>['members'][0], 'teams'>
    >;
  };

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  pages,
  aboutUs,
  training,
  members,
  scientificAdvisoryBoard,
}) => (
  <div css={styles}>
    {pages.length ? (
      <PagesSection title={'Grantee Guidance'} pages={pages} />
    ) : null}
    {training.length ? (
      <NewsSection title={'Training'} news={training} />
    ) : null}
    {aboutUs.length ? (
      <section>
        <Display styleAsHeading={2}>About us</Display>
        <div css={aboutUsStyles}>
          <Card>
            <RichText text={aboutUs} />
          </Card>
        </div>
      </section>
    ) : null}
    {members.length ? (
      <TeamMembersSection title={'Meet the team'} members={members} />
    ) : null}
    {scientificAdvisoryBoard.length ? (
      <TeamMembersSection
        title={'Meet the Scientific Advisory Board'}
        members={scientificAdvisoryBoard}
      />
    ) : null}
    <HelpSection />
  </div>
);

export default DashboardPageBody;
