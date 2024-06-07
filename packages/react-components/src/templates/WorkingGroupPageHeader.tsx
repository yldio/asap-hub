import { css } from '@emotion/react';
import { formatDistance } from 'date-fns';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { WorkingGroupResponse } from '@asap-hub/model';
import { networkRoutes } from '@asap-hub/routing';
import { useContext } from 'react';

import { mobileScreen, perRem, rem } from '../pixels';
import {
  Link,
  Display,
  StateTag,
  TabLink,
  Caption,
  CopyButton,
} from '../atoms';
import { paper, pine, steel } from '../colors';
import { networkPageLayoutPaddingStyle } from '../layout';
import {
  UserAvatarList,
  TabNav,
  DropdownButton,
  CalendarLink,
} from '../molecules';
import {
  article,
  bioinformatics,
  dataset,
  labResource,
  plusIcon,
  protocol,
  successIcon,
  crnReportIcon,
  googleDriveIcon,
  systemCalendarIcon,
} from '../icons';
import { createMailTo } from '../mail';

const containerStyles = css({
  backgroundColor: paper.rgb,
  padding: networkPageLayoutPaddingStyle,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  paddingBottom: 0,
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
    flexWrap: 'wrap',
    gap: `${16 / perRem}em`,
  },
});

const toolsStyles = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${12 / perRem}em`,
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexFlow: 'row',
    justifyContent: 'space-between',
  },
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    '> a': {
      marginBottom: 0,
    },
    gap: 0,
  },
});

const lastUpdatedStyles = css({
  alignSelf: 'center',
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
    "lab"     auto
    "contact" auto
    "create"  auto
  `,

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    grid: `
      "contact members create"
      "lab lab lab"/ max-content 1fr
    `,
  },
});

const pointOfContactStyles = css({
  gridArea: 'contact',
  display: 'flex',
  gap: `${8 / perRem}em`,
  margin: `${12 / perRem}em 0`,
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

type WorkingGroupPageHeaderProps = {
  readonly membersListElementId: string;
  readonly upcomingEventsCount?: number;
  readonly pastEventsCount?: number;
  readonly workingGroupsOutputsCount?: number;
  readonly workingGroupsDraftOutputsCount?: number;
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
  | 'calendars'
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
  workingGroupsOutputsCount = 0,
  workingGroupsDraftOutputsCount,
  upcomingEventsCount,
  pastEventsCount,
  calendars,
}) => {
  const { canShareResearchOutput } = useContext(
    ResearchOutputPermissionsContext,
  );

  const route = networkRoutes.DEFAULT.WORKING_GROUPS.DETAILS;

  return (
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
            networkRoutes.DEFAULT.WORKING_GROUPS.DETAILS.ABOUT.path

            // network({})
            //   .workingGroups({})
            //   .workingGroup({ workingGroupId: id })
            //   .about({}).$
          }#${membersListElementId}`}
        />
        {pointOfContact && !complete && (
          <div css={pointOfContactStyles}>
            <div css={{ display: 'flex', flexGrow: 1 }}>
              <Link
                buttonStyle
                small
                primary
                href={`${createMailTo(pointOfContact.user.email)}`}
                noMargin
              >
                Contact PM
              </Link>
            </div>
            <CopyButton
              hoverTooltipText="Copy Email"
              clickTooltipText="Email Copied"
              onClick={() =>
                navigator.clipboard.writeText(pointOfContact.user.email)
              }
            />
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
                href: route.CREATE_OUTPUT.buildPath({
                  workingGroupId: id,
                  outputDocumentType: 'article',
                }),
              }}
              {{
                item: <>{bioinformatics} Bioinformatics</>,
                href: route.CREATE_OUTPUT.buildPath({
                  workingGroupId: id,
                  outputDocumentType: 'bioinformatics',
                }),
              }}
              {{
                item: <>{crnReportIcon} CRN Report</>,
                href: route.CREATE_OUTPUT.buildPath({
                  workingGroupId: id,

                  outputDocumentType: 'report',
                }),
              }}
              {{
                item: <>{dataset} Dataset</>,
                href: route.CREATE_OUTPUT.buildPath({
                  workingGroupId: id,

                  outputDocumentType: 'dataset',
                }),
              }}
              {{
                item: <>{labResource} Lab Resource</>,
                href: route.CREATE_OUTPUT.buildPath({
                  workingGroupId: id,

                  outputDocumentType: 'lab-resource',
                }),
              }}
              {{
                item: <>{protocol} Protocol</>,
                href: route.CREATE_OUTPUT.buildPath({
                  workingGroupId: id,

                  outputDocumentType: 'protocol',
                }),
              }}
            </DropdownButton>
          </div>
        )}
      </section>
      <div css={rowStyles}>
        <div css={toolsStyles}>
          {externalLink && (
            <Link href={externalLink} buttonStyle small>
              {googleDriveIcon} Access Drive
            </Link>
          )}
          {calendars[0]?.id && !complete && (
            <CalendarLink id={calendars[0]?.id}>
              <span css={{ display: 'flex', gap: '8px' }}>
                {systemCalendarIcon}Subscribe
              </span>
            </CalendarLink>
          )}
        </div>
        <div css={lastUpdatedStyles}>
          <Caption asParagraph accent="lead">
            Last updated:{' '}
            {formatDistance(new Date(), new Date(lastModifiedDate))} ago
          </Caption>
        </div>
      </div>
      <TabNav>
        <TabLink href={route.ABOUT.relativePath}>About</TabLink>
        {!complete && (
          <TabLink href={route.CALENDAR.relativePath}>Calendar</TabLink>
        )}
        <TabLink href={route.OUTPUTS.relativePath}>
          Outputs ({workingGroupsOutputsCount})
        </TabLink>
        {workingGroupsDraftOutputsCount !== undefined && (
          <TabLink href={route.DRAFT_OUTPUTS.relativePath}>
            Draft Outputs ({workingGroupsDraftOutputsCount})
          </TabLink>
        )}

        {!complete && (
          <TabLink href={route.UPCOMING.relativePath}>
            Upcoming Events {`(${upcomingEventsCount})`}
          </TabLink>
        )}
        <TabLink href={route.PAST.relativePath}>
          Past Events {`(${pastEventsCount})`}
        </TabLink>
      </TabNav>
    </header>
  );
};

export default WorkingGroupPageHeader;
