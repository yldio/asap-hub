import { css } from '@emotion/react';
import { formatDistance } from 'date-fns';
import { WorkingGroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

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
  gap: `${16 / perRem}em`,
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

type WorkingGroupPageHeaderProps = {
  readonly membersListElementId: string;
} & Pick<
  WorkingGroupResponse,
  | 'id'
  | 'title'
  | 'complete'
  | 'lastModifiedDate'
  | 'leaders'
  | 'members'
  | 'externalLink'
  | 'pointOfContact'
>;

const WorkingGroupPageHeader: React.FC<WorkingGroupPageHeaderProps> = ({
  id,
  title,
  complete,
  lastModifiedDate,
  externalLink,
  pointOfContact,
  leaders,
  members,
  membersListElementId,
}) => (
  <header css={containerStyles}>
    <div css={titleStyle}>
      <Display styleAsHeading={2}>{title}</Display>
      {complete && (
        <StateTag accent="green" icon={successIcon} label="Complete" />
      )}
    </div>
    <section css={contactSectionStyles}>
      <UserAvatarList
        members={[...leaders, ...members].map((member) => member.user)}
        fullListRoute={`${
          network({}).workingGroups({}).workingGroup({ workingGroupId: id }).$
        }#${membersListElementId}`}
      />
      {pointOfContact && (
        <div css={pointOfContactStyles}>
          <Link
            buttonStyle
            small
            primary
            href={`${createMailTo(pointOfContact.user.email)}`}
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
          label="Working Group Folder"
          href={externalLink}
          size="large"
        />
      )}
      <div css={lastUpdatedStyles}>
        <Caption asParagraph accent="lead">
          Last updated: {formatDistance(new Date(), new Date(lastModifiedDate))}{' '}
          ago
        </Caption>
      </div>
    </div>
    <TabNav>
      <TabLink
        href={
          network({})
            .workingGroups({})
            .workingGroup({ workingGroupId: id })
            .about({}).$
        }
      >
        About
      </TabLink>
    </TabNav>
  </header>
);

export default WorkingGroupPageHeader;
