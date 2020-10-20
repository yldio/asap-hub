import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { PagesSection, RichText, MembersSection } from '../organisms';
import { perRem } from '../pixels';
import { Display, Card, Paragraph, Link } from '../atoms';
import { CtaCard } from '../molecules';

const styles = css({
  display: 'grid',
  gridRowGap: `${72 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

const aboutUsStyles = css({
  paddingTop: `${24 / perRem}em`,
});

const bottomStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type DashboardPageBodyProps = Omit<
  ComponentProps<typeof PagesSection>,
  'title'
> &
  Omit<ComponentProps<typeof MembersSection>, 'title'> & {
    readonly aboutUs: string;
  };

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  pages,
  aboutUs,
  members,
}) => (
  <div css={styles}>
    {pages.length ? (
      <PagesSection title={'Grantee Guidance'} pages={pages} />
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
    <section css={bottomStyles}>
      <CtaCard href={'#'} buttonText="Contact Us">
        <strong>Need help with grant-related matter?</strong>
        <br /> ASAP and the Michael J Fox Foundation are here to help
      </CtaCard>
      <Paragraph>
        If you're facing a technical issue with the Hub, please{' '}
        <Link href={'#'}>get in touch</Link>. Our support team is happy to help!
      </Paragraph>
    </section>
  </div>
);

export default DashboardPageBody;
