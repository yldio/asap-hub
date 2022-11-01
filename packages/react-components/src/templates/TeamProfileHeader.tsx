import { TeamResponse, TeamTool } from '@asap-hub/model';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useContext } from 'react';
import { Display, Link, StateTag, TabLink } from '../atoms';
import { lead, paper, pine } from '../colors';
import {
  article,
  bioinformatics,
  dataset,
  inactiveBadgeIcon,
  labIcon,
  labResource,
  plusIcon,
  protocol,
} from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../mail';
import { DropdownButton, MembersAvatars, TabNav } from '../molecules';
import { mobileScreen, perRem } from '../pixels';
import { getCounterString } from '../utils';

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

const dropdownButtonStyling = css({
  display: 'flex',
  columnGap: `${9 / perRem}em`,
  svg: {
    color: pine.rgb,
  },
});
const iconStyles = css({
  display: 'inline-grid',
  paddingRight: `${12 / perRem}em`,
});

type TeamProfileHeaderProps = Readonly<Omit<TeamResponse, 'tools'>> & {
  readonly inactiveSince?: string;
  readonly tools?: ReadonlyArray<TeamTool>;
  readonly teamListElementId: string;
  readonly upcomingEventsCount?: number;
  readonly teamOutputsCount?: number;
  readonly pastEventsCount?: number;
};

const TeamProfileHeader: React.FC<TeamProfileHeaderProps> = ({
  id,
  displayName,
  inactiveSince,
  members,
  pointOfContact,
  tools,
  teamListElementId,
  labCount,
  upcomingEventsCount,
  teamOutputsCount = 0,
  pastEventsCount,
}) => {
  const route = network({}).teams({}).team({ teamId: id });
  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);
  const isActive = !inactiveSince;

  return (
    <header css={containerStyles}>
      <div css={titleStyle}>
        <Display styleAsHeading={2}>Team {displayName}</Display>
        {!isActive && <StateTag icon={inactiveBadgeIcon} label="Inactive" />}
      </div>

      <section
        css={canCreateUpdate ? createSectionStyles : contactSectionStyles}
      >
        <MembersAvatars
          members={members}
          fullListRoute={`${route.about({}).$}#${teamListElementId}`}
        />
        {pointOfContact && !canCreateUpdate && (
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
        {canCreateUpdate && (
          <div css={createStyles}>
            <DropdownButton
              buttonChildren={() => (
                <span css={dropdownButtonStyling}>
                  {plusIcon}
                  Share an output
                </span>
              )}
            >
              {{
                item: <>{article} Article</>,
                href: route.createOutput({ outputDocumentType: 'article' }).$,
              }}
              {{
                item: <>{bioinformatics} Bioinformatics</>,
                href: route.createOutput({
                  outputDocumentType: 'bioinformatics',
                }).$,
              }}
              {{
                item: <>{dataset} Dataset</>,
                href: route.createOutput({ outputDocumentType: 'dataset' }).$,
              }}
              {{
                item: <>{labResource} Lab Resource</>,
                href: route.createOutput({ outputDocumentType: 'lab-resource' })
                  .$,
              }}
              {{
                item: <>{protocol} Protocol</>,
                href: route.createOutput({ outputDocumentType: 'protocol' }).$,
              }}
            </DropdownButton>
          </div>
        )}
      </section>
      <TabNav>
        <TabLink href={route.about({}).$}>About</TabLink>
        {tools && (
          <TabLink href={route.workspace({}).$}>Team Workspace</TabLink>
        )}
        <TabLink href={route.outputs({}).$}>
          Team Outputs ({teamOutputsCount})
        </TabLink>
        {isActive && (
          <TabLink href={route.upcoming({}).$}>
            Upcoming Events {`(${upcomingEventsCount})`}
          </TabLink>
        )}
        <TabLink href={route.past({}).$}>
          Past Events {`(${pastEventsCount})`}
        </TabLink>
      </TabNav>
    </header>
  );
};

export default TeamProfileHeader;
