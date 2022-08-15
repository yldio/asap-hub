import { css } from '@emotion/react';
import { DiscoverResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { HelpSection, RichText, TeamMembersSection } from '../organisms';
import { perRem } from '../pixels';
import { Card, Headline2, Link, Paragraph } from '../atoms';
import { externalLinkIcon } from '../icons';

const styles = css({
  display: 'grid',
  gridRowGap: `${33 / perRem}em`,
  paddingBottom: `${57 / perRem}em`,
});

const aboutUsStyles = css({
  paddingBottom: `${12 / perRem}em`,
});

type DiscoverAboutProps = Pick<
  DiscoverResponse,
  'members' | 'membersTeamId' | 'scientificAdvisoryBoard' | 'aboutUs'
>;

const DiscoverAbout: React.FC<DiscoverAboutProps> = ({
  members,
  scientificAdvisoryBoard,
  membersTeamId,
  aboutUs,
}) => {
  const membersTeamIdData = membersTeamId
    ? {
        href: network({}).teams({}).team({ teamId: membersTeamId }).$,
        hrefText: 'Explore the ASAP team',
      }
    : {};

  return (
    <section>
      <div css={aboutUsStyles}>
        <Headline2 styleAsHeading={3}>About ASAP</Headline2>
        <Paragraph accent="lead">
          Find out more about the ASAP team, the Hub and the Scientific Advisory
          Board.
        </Paragraph>
      </div>
      <div css={styles}>
        <TeamMembersSection
          title="Meet the ASAP team"
          members={members.map((member) => ({
            ...member,
            firstLine: member.displayName,
            secondLine: member.jobTitle,
            thirdLine: member.institution,
          }))}
          {...membersTeamIdData}
        />
        <Card>
          <RichText text={aboutUs} />
          <div css={{ display: 'inline-block' }}>
            <Link
              buttonStyle
              small
              primary
              href="https://parkinsonsroadmap.org/"
            >
              Read more on ASAP’s website {externalLinkIcon}
            </Link>
          </div>
        </Card>
        <TeamMembersSection
          title="Meet the Scientific Advisory Board"
          members={scientificAdvisoryBoard.map((member) => ({
            ...member,
            firstLine: member.displayName,
            secondLine: member.jobTitle,
            thirdLine: member.institution,
          }))}
        />
      </div>
      <HelpSection />
    </section>
  );
};

export default DiscoverAbout;
