import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import {
  PagesSection,
  RichText,
  MembersSection,
  HelpSection,
  NewsAndEventsSection,
} from '../organisms';
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
  Omit<ComponentProps<typeof MembersSection>, 'title'> & {
    readonly aboutUs: string;
    readonly training: ComponentProps<
      typeof NewsAndEventsSection
    >['newsAndEvents'];
  };

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  pages,
  aboutUs,
  training,
  members,
}) => (
  <div css={styles}>
    {pages.length ? (
      <PagesSection title={'Grantee Guidance'} pages={pages} />
    ) : null}
    {training.length ? (
      <NewsAndEventsSection title={'Training'} newsAndEvents={training} />
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
      <MembersSection title={'Meet the ASAP team'} members={members} />
    ) : null}
    <HelpSection />
  </div>
);

export default DashboardPageBody;
