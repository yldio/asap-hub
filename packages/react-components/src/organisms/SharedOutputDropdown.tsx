import { useState } from 'react';
import { css } from '@emotion/react';

import { useCurrentUserCRN } from '@asap-hub/react-context';
import { UserTeam, WorkingGroupMembership } from '@asap-hub/model';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  getUserRole,
  hasShareResearchOutputPermission,
} from '@asap-hub/validation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from '@asap-hub/auth';

import {
  article,
  bioinformatics,
  crnReportIcon,
  dataset,
  labResource,
  plusIcon,
  protocol,
  TeamIcon,
  WorkingGroupsIcon,
  chevronRightIcon,
  chevronLeftIcon,
} from '../icons';
import DropdownButton, { ItemType } from '../molecules/DropdownButton';
import { perRem } from '../pixels';
import { Ellipsis } from '../atoms';

const iconStyles = css({
  display: 'flex',
  marginRight: `${8 / perRem}em`,
});

export type Association = WorkingGroupMembership | UserTeam;

const isWGMembership = (
  association: Association,
): association is WorkingGroupMembership =>
  (association as WorkingGroupMembership).name !== undefined;

const itemStyles = css({
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'min-content 1fr min-content',
  gridGap: `${12 / perRem}em`,
  fontSize: `${17 / perRem}em`,
  lineHeight: `${24 / 17}em`,
  textAlign: 'left',
});

export const AssociationItem: React.FC<{
  association: Association;
  open?: boolean;
}> = ({ association, open = false }) => (
  <div css={itemStyles}>
    {isWGMembership(association) ? (
      <>
        <WorkingGroupsIcon />
        <Ellipsis>{association.name}</Ellipsis>
      </>
    ) : (
      <>
        <TeamIcon />
        <Ellipsis>{association.displayName}</Ellipsis>
      </>
    )}
    {open ? chevronLeftIcon : chevronRightIcon}
  </div>
);

type SharedOutputDropdownProps = {
  children?: never;
  user: User | null;
};

export const SharedOutputDropdownBase: React.FC<SharedOutputDropdownProps> = ({
  user,
}) => {
  const [selectedAssociation, setSelectedAssociation] = useState<
    Association | undefined
  >(undefined);

  const associations = [
    ...(user?.teams ?? [])
      .concat()
      .filter((team) => {
        const userRole = getUserRole(user, 'teams', [team.id]);
        return hasShareResearchOutputPermission(userRole);
      })
      .sort((a, b) => (a.displayName ?? '').localeCompare(b.displayName ?? ''))
      .map((team) => ({
        item: <AssociationItem association={team} />,
        closeOnClick: false,
        onClick: () => setSelectedAssociation(team),
      })),
    ...(user?.workingGroups ?? [])
      .concat()
      .filter((workingGroup) => {
        const userRole = getUserRole(user, 'workingGroups', [workingGroup.id]);
        return hasShareResearchOutputPermission(userRole);
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((wg) => ({
        item: <AssociationItem association={wg} />,
        closeOnClick: false,
        onClick: () => setSelectedAssociation(wg),
      })),
  ];

  if (associations.length === 0) {
    return null;
  }

  const routeLink = (
    association: Association,
    outputDocumentType: OutputDocumentTypeParameter,
  ) =>
    isWGMembership(association)
      ? network({})
          .workingGroups({})
          .workingGroup({ workingGroupId: association.id })
          .createOutput({ outputDocumentType }).$
      : network({}).teams({}).team({ teamId: association.id }).createOutput({
          outputDocumentType,
        }).$;

  return (
    <DropdownButton
      primary
      trimmedList
      buttonChildren={() => (
        <>
          <div css={iconStyles}>{plusIcon}</div> Share an output
        </>
      )}
    >
      {selectedAssociation
        ? [
            {
              item: <AssociationItem open association={selectedAssociation} />,
              closeOnClick: false,
              type: 'title',
              onClick: () => setSelectedAssociation(undefined),
            },
            {
              item: <>{article} Article</>,
              type: 'inner' as ItemType,
              href: routeLink(selectedAssociation, 'article'),
            },
            {
              item: <>{bioinformatics} Bioinformatics</>,
              type: 'inner' as ItemType,
              href: routeLink(selectedAssociation, 'bioinformatics'),
            },
            {
              item: <>{crnReportIcon} CRN Report</>,
              type: 'inner' as ItemType,
              href: routeLink(selectedAssociation, 'report'),
            },
            {
              item: <>{dataset} Dataset</>,
              type: 'inner' as ItemType,
              href: routeLink(selectedAssociation, 'dataset'),
            },
            {
              item: <>{labResource} Lab Resource</>,
              type: 'inner' as ItemType,
              href: routeLink(selectedAssociation, 'lab-resource'),
            },
            {
              item: <>{protocol} Protocol</>,
              type: 'inner' as ItemType,
              href: routeLink(selectedAssociation, 'protocol'),
            },
          ]
        : associations}
    </DropdownButton>
  );
};

const SharedOutputDropdown = () => {
  const user = useCurrentUserCRN();
  return <SharedOutputDropdownBase user={user} />;
};

export default SharedOutputDropdown;
