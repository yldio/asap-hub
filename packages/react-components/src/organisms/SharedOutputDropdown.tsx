import { useState } from 'react';
import { css } from '@emotion/react';

import { useCurrentUserCRN } from '@asap-hub/react-context';
import {
  UserTeam,
  WorkingGroupMembership,
  gp2 as gp2Model,
} from '@asap-hub/model';
import { networkRoutes, OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  getUserRole,
  hasShareResearchOutputPermission,
} from '@asap-hub/validation';
import type { User } from '@asap-hub/auth';
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
import DropdownButton, {
  ItemType,
  ItemData,
} from '../molecules/DropdownButton';
import { perRem } from '../pixels';

const ITEM_HEIGHT = 48;
const DROPDOWN_TOP_PADDING = 5;
const NUM_ITEMS_TO_SHOW = 8.5;

const iconStyles = css({
  display: 'flex',
  marginRight: `${8 / perRem}em`,
});

export type Association =
  | WorkingGroupMembership
  | UserTeam
  | gp2Model.UserProject
  | gp2Model.UserWorkingGroup;

const isWGMembership = (
  association: Association,
): association is WorkingGroupMembership =>
  (association as WorkingGroupMembership).name !== undefined;

const isUserTeam = (association: Association): association is UserTeam =>
  (association as UserTeam).displayName !== undefined;

const isUserProject = (
  association: Association,
): association is gp2Model.UserProject =>
  (association as gp2Model.UserProject).status !== undefined;

const itemStyles = css({
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'min-content 1fr min-content',
  gridGap: `${12 / perRem}em`,
  fontSize: `${17 / perRem}em`,
  lineHeight: `${24 / 17}em`,
  textAlign: 'left',
  textWrap: 'wrap',
});

export const AssociationItem: React.FC<{
  association: Association;
  open?: boolean;
}> = ({ association, open = false }) => (
  <div css={itemStyles}>
    {isWGMembership(association) ? (
      <>
        <WorkingGroupsIcon />
        {association.name}
      </>
    ) : isUserTeam(association) ? (
      <>
        <TeamIcon />
        {association.displayName}
      </>
    ) : isUserProject(association) ? (
      <>
        <TeamIcon />
        {association.title}
      </>
    ) : (
      <>
        <WorkingGroupsIcon />
        {association.title}
      </>
    )}
    {open ? chevronLeftIcon : chevronRightIcon}
  </div>
);

type SharedOutputDropdownBaseProps = {
  children?: never;
  associations: ReadonlyArray<Association>;
  dropdownOptions: (association: Association) => ReadonlyArray<ItemData>;
  alignLeft?: boolean;
};

type SharedOutputDropdownProps = {
  children?: never;
  user: User | null;
};

export const SharedOutputDropdownBase: React.FC<
  SharedOutputDropdownBaseProps
> = ({ associations, dropdownOptions, alignLeft = false }) => {
  const [selectedAssociation, setSelectedAssociation] = useState<
    Association | undefined
  >(undefined);

  if (associations.length === 0) {
    return null;
  }

  const associationLinks = associations.map((association) => ({
    item: <AssociationItem association={association} />,
    closeOnClick: false,
    onClick: () => setSelectedAssociation(association),
  }));

  return (
    <DropdownButton
      primary
      dropdownHeight={ITEM_HEIGHT * NUM_ITEMS_TO_SHOW - DROPDOWN_TOP_PADDING}
      buttonChildren={() => (
        <>
          <div css={iconStyles}>{plusIcon}</div> Share an output
        </>
      )}
      alignLeft={alignLeft}
    >
      {selectedAssociation
        ? [
            {
              item: <AssociationItem open association={selectedAssociation} />,
              closeOnClick: false,
              type: 'title',
              onClick: () => setSelectedAssociation(undefined),
            },
            ...dropdownOptions(selectedAssociation),
          ]
        : associationLinks}
    </DropdownButton>
  );
};

export const SharedOutputDropdownWrapper: React.FC<
  SharedOutputDropdownProps
> = ({ user }) => {
  const associations = [
    ...(user?.teams ?? [])
      .concat()
      .filter((team) => {
        const userRole = getUserRole(user, 'teams', [team.id]);
        return hasShareResearchOutputPermission(userRole);
      })
      .sort((a, b) => (a.displayName ?? '').localeCompare(b.displayName ?? '')),
    ...(user?.workingGroups ?? [])
      .concat()
      .filter((workingGroup) => {
        const userRole = getUserRole(user, 'workingGroups', [workingGroup.id]);
        return hasShareResearchOutputPermission(userRole);
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const routeLink = (
    association: Association,
    outputDocumentType: OutputDocumentTypeParameter,
  ) =>
    // TODO: fix this
    // networkRoutes.DEFAULT.path;
    isWGMembership(association)
      ? networkRoutes.DEFAULT.WORKING_GROUPS.DETAILS.CREATE_OUTPUT.buildPath({
          workingGroupId: association.id,
          outputDocumentType,
        })
      : // .workingGroups({})
        // .workingGroup({ workingGroupId: association.id })
        // .createOutput({ outputDocumentType }).$
        networkRoutes.DEFAULT.TEAMS.DETAILS.CREATE_OUTPUT.buildPath({
          teamId: association.id,
          outputDocumentType,
        });
  // network({}).teams({}).team({ teamId: association.id }).createOutput({
  //     outputDocumentType,
  //   }).$;

  const dropdownOptions = (selectedAssociation: Association) => [
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
  ];

  return (
    <SharedOutputDropdownBase
      associations={associations}
      dropdownOptions={dropdownOptions}
    />
  );
};

const SharedOutputDropdown = () => {
  const user = useCurrentUserCRN();
  return <SharedOutputDropdownWrapper user={user} />;
};

export default SharedOutputDropdown;
