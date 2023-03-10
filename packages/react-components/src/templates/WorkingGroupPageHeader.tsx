import { css } from '@emotion/react';
import { formatDistance } from 'date-fns';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { WorkingGroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { useContext } from 'react';

import { mobileScreen, perRem, rem } from '../pixels';
import { Link, Display, StateTag, TabLink, Caption } from '../atoms';
import { paper, pine, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import {
  UserAvatarList,
  TabNav,
  ExternalLink,
  DropdownButton,
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
} from '../icons';
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
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'block',
  },
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
  workingGroupsOutputsCount = 0,
  upcomingEventsCount,
  pastEventsCount,
}) => {
  const { canShareResearchOutput } = useContext(
    ResearchOutputPermissionsContext,
  );

  const route = network({})
    .workingGroups({})
    .workingGroup({ workingGroupId: id });

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
            network({})
              .workingGroups({})
              .workingGroup({ workingGroupId: id })
              .about({}).$
          }#${membersListElementId}`}
        />
        {pointOfContact && !canShareResearchOutput && (
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
                href: route.createOutput({
                  workingGroupOutputDocumentType: 'article',
                }).$,
              }}
              {{
                item: <>{bioinformatics} Bioinformatics</>,
                href: route.createOutput({
                  workingGroupOutputDocumentType: 'bioinformatics',
                }).$,
              }}
              {{
                item: <>{dataset} Dataset</>,
                href: route.createOutput({
                  workingGroupOutputDocumentType: 'dataset',
                }).$,
              }}
              {{
                item: <>{labResource} Lab Resource</>,
                href: route.createOutput({
                  workingGroupOutputDocumentType: 'lab-resource',
                }).$,
              }}
              {{
                item: <>{protocol} Protocol</>,
                href: route.createOutput({
                  workingGroupOutputDocumentType: 'protocol',
                }).$,
              }}
              {{
                item: <>{crnReportIcon} CRN Report</>,
                href: route.createOutput({
                  workingGroupOutputDocumentType: 'report',
                }).$,
              }}
            </DropdownButton>
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
            Last updated:{' '}
            {formatDistance(new Date(), new Date(lastModifiedDate))} ago
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
        {!complete && <TabLink href={route.calendar({}).$}>Calendar</TabLink>}
        <TabLink
          href={
            network({})
              .workingGroups({})
              .workingGroup({ workingGroupId: id })
              .outputs({}).$
          }
        >
          Working Group Outputs ({workingGroupsOutputsCount})
        </TabLink>
        {!complete && (
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

export default WorkingGroupPageHeader;
