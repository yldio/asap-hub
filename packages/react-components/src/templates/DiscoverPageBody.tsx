import { css } from '@emotion/react';
import { DiscoverResponse } from '@asap-hub/model';

import {
  PagesSection,
  RichText,
  TeamMembersSection,
  HelpSection,
  NewsSection,
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

const DiscoverPageBody: React.FC<DiscoverResponse> = ({
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
      <TeamMembersSection
        title={'Meet the ASAP team'}
        members={members.map(
          ({
            displayName,
            jobTitle,
            institution,
            firstName,
            lastName,
            avatarUrl,
            id,
          }) => ({
            firstLine: displayName,
            secondLine: jobTitle || '',
            thirdLine: institution || '',
            avatarUrl,
            firstName,
            lastName,
            id,
          }),
        )}
      />
    ) : null}
    {scientificAdvisoryBoard.length ? (
      <TeamMembersSection
        title={'Meet the Scientific Advisory Board'}
        members={scientificAdvisoryBoard.map(
          ({
            displayName,
            jobTitle,
            institution,
            firstName,
            lastName,
            avatarUrl,
            id,
          }) => ({
            firstLine: displayName,
            secondLine: jobTitle || '',
            thirdLine: institution || '',
            avatarUrl,
            firstName,
            lastName,
            id,
          }),
        )}
      />
    ) : null}
    <HelpSection />
  </div>
);

export default DiscoverPageBody;
