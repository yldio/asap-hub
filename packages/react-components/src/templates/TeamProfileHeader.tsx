import { isEnabled } from '@asap-hub/flags';
import { TeamResponse, TeamTool } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { Anchor, Avatar, Display, Link, TabLink } from '../atoms';
import { lead, paper } from '../colors';
import { labIcon, libraryIcon, plusIcon } from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../mail';
import { DropdownButton, TabNav } from '../molecules';
import { mobileScreen, perRem } from '../pixels';
import { getCounterString } from '../utils';

const MAX_MEMBER_AVATARS = 5;
const MEMBER_AVATAR_BORDER_WIDTH = 1;

const containerStyles = css({
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)} 0`,
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

const createSectionStyles = css({
  alignItems: 'center',

  display: 'grid',
  gridColumnGap: `${16 / perRem}em`,

  grid: `
    "members" auto
    "lab"    auto
    "create" auto
  `,

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    grid: `
      "members create"
      "lab lab"/ 1fr max-content
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

const membersContainerStyles = css({
  gridArea: 'members',
  padding: `${12 / perRem}em 0`,

  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateColumns: `
    repeat(
      ${MAX_MEMBER_AVATARS},
      minmax(auto, ${36 + MEMBER_AVATAR_BORDER_WIDTH * 2}px)
    )
    ${6 / perRem}em
    minmax(auto, ${36 + MEMBER_AVATAR_BORDER_WIDTH * 2}px)
  `,
});
const labCountStyles = css({
  gridArea: 'lab',
  display: 'flex',
  alignItems: 'center',
  padding: `${12 / perRem}em 0`,
  color: lead.rgb,
});
const createStyles = css({
  gridArea: 'create',
  display: 'flex',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'block',
  },
});
const membersListStyles = css({
  display: 'contents',
  listStyle: 'none',
});
const extraUsersStyles = css({
  display: 'block',
  gridColumnEnd: '-1',
});
const listItemStyles = css({
  border: '1px solid white',
  borderRadius: '50%',
  position: 'relative',
});
const dropdownButtonStyling = css({
  display: 'flex',
  columnGap: `${9 / perRem}em`,
});
const dropdownItemStyling = css({
  display: 'flex',
  columnGap: `${12 / perRem}em`,
  fontWeight: 'normal',
});
const iconStyles = css({
  display: 'inline-grid',
  paddingRight: `${12 / perRem}em`,
});

type TeamProfileHeaderProps = Readonly<Omit<TeamResponse, 'tools'>> & {
  readonly tools?: ReadonlyArray<TeamTool>;
  readonly teamListElementId: string;
};
const TeamProfileHeader: React.FC<TeamProfileHeaderProps> = ({
  id,
  displayName,
  members,
  pointOfContact,
  tools,
  teamListElementId,
  labCount,
}) => {
  const route = network({}).teams({}).team({ teamId: id });
  const showCreateButton = isEnabled('ROMS_FORM');
  return (
    <header css={containerStyles}>
      <Display styleAsHeading={2}>Team {displayName}</Display>
      <section
        css={showCreateButton ? createSectionStyles : contactSectionStyles}
      >
        <div css={membersContainerStyles}>
          <ul css={membersListStyles}>
            {members
              .slice(0, MAX_MEMBER_AVATARS)
              .map(({ id: memberId, avatarUrl, firstName, lastName }, i) => (
                <li
                  key={memberId}
                  css={[listItemStyles, { left: `-${i * 3}px` }]}
                >
                  <Anchor
                    href={network({}).users({}).user({ userId: memberId }).$}
                  >
                    <Avatar
                      firstName={firstName}
                      lastName={lastName}
                      imageUrl={avatarUrl}
                    />
                  </Anchor>
                </li>
              ))}
            <li css={extraUsersStyles}>
              {members.length > MAX_MEMBER_AVATARS && (
                <Anchor href={`${route.about({}).$}#${teamListElementId}`}>
                  <Avatar
                    placeholder={`+${members.length - MAX_MEMBER_AVATARS}`}
                  />
                </Anchor>
              )}
            </li>
          </ul>
        </div>
        {pointOfContact && !showCreateButton && (
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
        {labCount > 0 && (
          <div css={labCountStyles}>
            <span css={iconStyles}>{labIcon} </span>
            <span>{getCounterString(labCount, 'Lab')}</span>
          </div>
        )}
        {showCreateButton && (
          <div css={createStyles}>
            <DropdownButton
              buttonChildren={() => (
                <span css={dropdownButtonStyling}>
                  {plusIcon}
                  Share an output
                </span>
              )}
            >
              <Anchor href={route.createOutput({ outputType: 'article' }).$}>
                <span css={dropdownItemStyling}>{libraryIcon} Article </span>
              </Anchor>
              <Anchor
                href={route.createOutput({ outputType: 'bioinformatics' }).$}
              >
                <span css={dropdownItemStyling}>
                  {libraryIcon} Bioinformatics
                </span>
              </Anchor>
              <Anchor href={route.createOutput({ outputType: 'dataset' }).$}>
                <span css={dropdownItemStyling}>{libraryIcon} Dataset </span>
              </Anchor>
              <Anchor
                href={route.createOutput({ outputType: 'lab-resource' }).$}
              >
                <span css={dropdownItemStyling}>
                  {libraryIcon} Lab Resource
                </span>
              </Anchor>
              <Anchor href={route.createOutput({ outputType: 'protocol' }).$}>
                <span css={dropdownItemStyling}>{libraryIcon} Protocol </span>
              </Anchor>
            </DropdownButton>
          </div>
        )}
      </section>
      <TabNav>
        <TabLink href={route.about({}).$}>About</TabLink>
        {tools && (
          <TabLink href={route.workspace({}).$}>Team Workspace</TabLink>
        )}
        <TabLink href={route.outputs({}).$}>Team Outputs</TabLink>
      </TabNav>
    </header>
  );
};

export default TeamProfileHeader;
