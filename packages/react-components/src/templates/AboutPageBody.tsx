import { css } from '@emotion/react';
import { DiscoverResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { HelpSection, RichText, TeamMembersSection } from '../organisms';
import { perRem } from '../pixels';
import { Card, Link } from '../atoms';
import { ExternalLinkIcon } from '../icons';

const styles = css({
  display: 'grid',
  gridRowGap: `${33 / perRem}em`,
  paddingBottom: `${57 / perRem}em`,
});

type AboutPageBodyProps = Pick<
  DiscoverResponse,
  'members' | 'membersTeamId' | 'scientificAdvisoryBoard' | 'aboutUs'
>;

const AboutPageBody: React.FC<AboutPageBodyProps> = ({
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
    <>
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
              Read more on ASAP’s website {<ExternalLinkIcon />}
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
    </>
  );
};

export default AboutPageBody;
