import { css } from '@emotion/react';
import { formatDistance } from 'date-fns';
import { network } from '@asap-hub/routing';
import { TeamResponse } from '@asap-hub/model';

import { mobileScreen, perRem } from '../pixels';
import { Link, Display, StateTag, TabLink, Caption } from '../atoms';
import { paper } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { MembersAvatars, TabNav } from '../molecules';
import { checkmarkInCircle, externalLinkIcon } from '../icons';
import { createMailTo } from '../mail';

const containerStyles = css({
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)} 0`,
});

const titleStyle = css({
  display: 'flex',
  flexFlow: 'column',
  gap: 3,
  alignItems: 'flex-start',
  paddingBottom: `${12 / perRem}em`,
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexFlow: 'row',
    gap: `${15 / perRem}em`,
    alignItems: 'center',
  },
});

const rowStyles = css({
  display: 'flex',
  flexFlow: 'column',
  alignItems: 'center',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexFlow: 'row',
    justifyContent: 'space-between',
  },
});

const lastUpdatedStyles = css({
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginRight: 'auto',
  },
});

const contactSectionStyles = css({
  alignItems: 'center',

  display: 'grid',
  gridColumnGap: `${16 / perRem}em`,

  grid: `
    "members" auto
    "lab"    auto
    "contact" auto
  `,

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    grid: `
      "contact members"
      "lab lab"/ max-content 1fr
    `,
  },
});

const pointOfContactStyles = css({
  gridArea: 'contact',
  display: 'flex',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'block',
  },
});
type WorkingGroupPageHeaderProps = Pick<
  TeamResponse,
  'members' | 'pointOfContact'
> & {
  name: string;
  complete: boolean;
  description: string;
  externalLink: string;
  externalLinkText: string;
  lastUpdated: string;
};

const WorkingGroupPageHeader: React.FC<WorkingGroupPageHeaderProps> = ({
  name,
  complete,
  lastUpdated,
  externalLink,
  externalLinkText,
  pointOfContact,
  members,
}) => {
  return (
    <header css={containerStyles}>
      <div css={titleStyle}>
        <Display styleAsHeading={2}>{name}</Display>
        {complete && (
          <StateTag
            backgroundColor="mint"
            textColor="fern"
            icon={checkmarkInCircle}
            label="Complete"
          />
        )}
      </div>
      <section css={contactSectionStyles}>
        <MembersAvatars members={members} fullListRoute="fullRoute" />
        {pointOfContact && (
          <div css={pointOfContactStyles}>
            <Link
              buttonStyle
              small
              primary
              href={`${createMailTo(pointOfContact.email)}`}
            >
              Contact PM
            </Link>
          </div>
        )}
      </section>
      <div css={rowStyles}>
        <Link buttonStyle small href={externalLink}>
          {externalLinkIcon}
          {externalLinkText}
        </Link>
        <div css={lastUpdatedStyles}>
          <Caption asParagraph accent="lead">
            Last updated: {formatDistance(new Date(), new Date(lastUpdated))}{' '}
            ago
          </Caption>
        </div>
      </div>
      <TabNav>
        <TabLink href={network({}).users({}).$}>About</TabLink>
      </TabNav>
    </header>
  );
};

export default WorkingGroupPageHeader;
