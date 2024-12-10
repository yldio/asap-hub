import { isEnabled } from '@asap-hub/flags';
import { TeamResponse, TeamTool } from '@asap-hub/model';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useContext } from 'react';
import { CopyButton, Display, Link, StateTag, TabLink } from '../atoms';
import { lead, paper, pine } from '../colors';
import {
  article,
  bioinformatics,
  crnReportIcon,
  dataset,
  InactiveBadgeIcon,
  LabIcon,
  labMaterial,
  plusIcon,
  protocol,
} from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../mail';
import { DropdownButton, UserAvatarList, TabNav } from '../molecules';
import { mobileScreen, perRem, tabletScreen } from '../pixels';
import { getCounterString } from '../utils';

const containerStyles = css({
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
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
    "contact" auto
    "lab"    auto
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
    "contact" auto
    "create" auto
    "lab"    auto
  `,

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    grid: `
      "contact members create"
      "lab lab lab"/ auto auto 1fr
    `,
  },
});
const pointOfContactStyles = css({
  display: 'flex',
  flexFlow: 'row',
  gap: `${8 / perRem}em`,
  margin: `${12 / perRem}em 0`,
});

const buttonStyles = css({
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    display: 'flex',
    flexGrow: 1,
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
    justifySelf: 'end',
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
  readonly isStaff: boolean;
  readonly inactiveSince?: string;
  readonly tools?: ReadonlyArray<TeamTool>;
  readonly teamListElementId: string;
  readonly upcomingEventsCount?: number;
  readonly teamOutputsCount?: number;
  readonly pastEventsCount?: number;
  readonly teamDraftOutputsCount?: number;
  readonly isAsapTeam?: boolean;
  readonly manuscriptsCount?: number;
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
  teamDraftOutputsCount,
  isStaff,
  manuscriptsCount,
  isAsapTeam = false,
}) => {
  const route = network({}).teams({}).team({ teamId: id });
  const { canShareResearchOutput } = useContext(
    ResearchOutputPermissionsContext,
  );

  const isActive = !inactiveSince;

  return (
    <header css={containerStyles}>
      <div css={titleStyle}>
        <Display styleAsHeading={2}>Team {displayName}</Display>
        {!isActive && (
          <StateTag icon={<InactiveBadgeIcon />} label="Inactive" />
        )}
      </div>

      <section
        css={
          canShareResearchOutput ? createSectionStyles : contactSectionStyles
        }
      >
        <UserAvatarList
          members={members}
          fullListRoute={`${route.about({}).$}#${teamListElementId}`}
        />
        {pointOfContact && (
          <div css={pointOfContactStyles}>
            <span css={buttonStyles}>
              <Link
                buttonStyle
                small
                primary
                href={`${createMailTo(pointOfContact.email)}`}
                noMargin
              >
                Contact PM
              </Link>
            </span>
            <CopyButton
              hoverTooltipText="Copy Email"
              clickTooltipText="Email Copied"
              onClick={() =>
                navigator.clipboard.writeText(pointOfContact.email)
              }
            />
          </div>
        )}
        {labCount > 0 && (
          <div css={labCountStyles}>
            <span css={iconStyles}>
              <LabIcon />
            </span>
            <span>{getCounterString(labCount, 'Lab')}</span>
          </div>
        )}
        {canShareResearchOutput && (
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
                item: <>{crnReportIcon} CRN Report</>,
                href: route.createOutput({
                  outputDocumentType: 'report',
                }).$,
              }}
              {{
                item: <>{dataset} Dataset</>,
                href: route.createOutput({ outputDocumentType: 'dataset' }).$,
              }}
              {{
                item: <>{labMaterial} Lab Material</>,
                href: route.createOutput({
                  outputDocumentType: 'lab-material',
                }).$,
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
        {(tools || isStaff) && (
          <TabLink href={route.workspace({}).$}>Team Workspace</TabLink>
        )}
        {isAsapTeam && isStaff && isEnabled('DISPLAY_MANUSCRIPTS') && (
          <TabLink href={route.compliance({}).$}>
            Compliance ({manuscriptsCount})
          </TabLink>
        )}
        <TabLink href={route.outputs({}).$}>
          Outputs ({teamOutputsCount})
        </TabLink>
        {teamDraftOutputsCount !== undefined ? (
          <TabLink href={route.draftOutputs({}).$}>
            Draft Outputs ({teamDraftOutputsCount})
          </TabLink>
        ) : null}
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
