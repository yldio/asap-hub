import { css } from '@emotion/react';
import { formatDistance } from 'date-fns';
import { workingGroups } from '@asap-hub/routing';
import { TeamResponse } from '@asap-hub/model';

import { mobileScreen, perRem, rem } from '../pixels';
import { Link, Display, StateTag, TabLink, Caption } from '../atoms';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { UserAvatarList, TabNav, ExternalLink } from '../molecules';
import { successIcon } from '../icons';
import { createMailTo } from '../mail';

const containerStyles = css({
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  marginBottom: `${30 / perRem}em`,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const titleStyle = css({
  display: 'flex',
  flexFlow: 'column',
  gap: rem(3),
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
  id: string;
  name: string;
  complete: boolean;
  description: string;
  externalLink: string;
  externalLinkText: string;
  lastUpdated: string;
};

const WorkingGroupPageHeader: React.FC<WorkingGroupPageHeaderProps> = ({
  id,
  name,
  complete,
  lastUpdated,
  externalLink,
  externalLinkText,
  pointOfContact,
  members,
}) => (
  <header css={containerStyles}>
    <div css={titleStyle}>
      <Display styleAsHeading={2}>{name}</Display>
      {complete && (
        <StateTag accent="green" icon={successIcon} label="Complete" />
      )}
    </div>
    <section css={contactSectionStyles}>
      <UserAvatarList
        members={members}
        fullListRoute={workingGroups({}).workingGroup({ workingGroupId: id }).$}
      />
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
      {externalLink && (
        <ExternalLink
          full
          label={externalLinkText}
          href={externalLink}
          size="large"
        />
      )}
      <div css={lastUpdatedStyles}>
        <Caption asParagraph accent="lead">
          Last updated: {formatDistance(new Date(), new Date(lastUpdated))} ago
        </Caption>
      </div>
    </div>
    <TabNav>
      <TabLink
        href={
          workingGroups({}).workingGroup({ workingGroupId: id }).about({}).$
        }
      >
        About
      </TabLink>
    </TabNav>
  </header>
);

export default WorkingGroupPageHeader;
