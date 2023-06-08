import { useState } from 'react';
import { css } from '@emotion/react';
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
import { DropdownButton } from '../molecules';
import { perRem } from '../pixels';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { UserTeam, WorkingGroupMembership } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { Ellipsis } from '../atoms';
import {
  getUserRole,
  hasShareResearchOutputPermission,
} from '@asap-hub/validation';

const iconStyles = css({
  display: 'flex',
  marginRight: `${8 / perRem}em`,
});

type Association = WorkingGroupMembership | UserTeam;

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

const AssociationItem: React.FC<{
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
};
const SharedOutputDropdown: React.FC<SharedOutputDropdownProps> = ({}) => {
  const user = useCurrentUserCRN();
  const [selectedAssociation, setSelectedAssociation] = useState<
    Association | undefined
  >(undefined);

  return (
    <DropdownButton
      primary
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
              forceHover: true,
              onClick: () => setSelectedAssociation(undefined),
            },
            ...(isWGMembership(selectedAssociation)
              ? [
                  {
                    item: <>{article} Article</>,
                    href: network({})
                      .workingGroups({})
                      .workingGroup({ workingGroupId: selectedAssociation.id })
                      .createOutput({
                        workingGroupOutputDocumentType: 'article',
                      }).$,
                  },
                  {
                    item: <>{bioinformatics} Bioinformatics</>,
                    href: network({})
                      .workingGroups({})
                      .workingGroup({ workingGroupId: selectedAssociation.id })
                      .createOutput({
                        workingGroupOutputDocumentType: 'bioinformatics',
                      }).$,
                  },
                  {
                    item: <>{dataset} Dataset</>,
                    href: network({})
                      .workingGroups({})
                      .workingGroup({ workingGroupId: selectedAssociation.id })
                      .createOutput({
                        workingGroupOutputDocumentType: 'dataset',
                      }).$,
                  },
                  {
                    item: <>{labResource} Lab Resource</>,
                    href: network({})
                      .workingGroups({})
                      .workingGroup({ workingGroupId: selectedAssociation.id })
                      .createOutput({
                        workingGroupOutputDocumentType: 'lab-resource',
                      }).$,
                  },
                  {
                    item: <>{protocol} Protocol</>,
                    href: network({})
                      .workingGroups({})
                      .workingGroup({ workingGroupId: selectedAssociation.id })
                      .createOutput({
                        workingGroupOutputDocumentType: 'protocol',
                      }).$,
                  },
                  {
                    item: <>{crnReportIcon} CRN Report</>,
                    href: network({})
                      .workingGroups({})
                      .workingGroup({ workingGroupId: selectedAssociation.id })
                      .createOutput({
                        workingGroupOutputDocumentType: 'report',
                      }).$,
                  },
                ]
              : [
                  {
                    item: <>{article} Article</>,
                    href: network({})
                      .teams({})
                      .team({ teamId: selectedAssociation.id })
                      .createOutput({
                        teamOutputDocumentType: 'article',
                      }).$,
                  },
                  {
                    item: <>{bioinformatics} Bioinformatics</>,
                    href: network({})
                      .teams({})
                      .team({ teamId: selectedAssociation.id })
                      .createOutput({
                        teamOutputDocumentType: 'bioinformatics',
                      }).$,
                  },
                  {
                    item: <>{dataset} Dataset</>,
                    href: network({})
                      .teams({})
                      .team({ teamId: selectedAssociation.id })
                      .createOutput({
                        teamOutputDocumentType: 'dataset',
                      }).$,
                  },
                  {
                    item: <>{labResource} Lab Resource</>,
                    href: network({})
                      .teams({})
                      .team({ teamId: selectedAssociation.id })
                      .createOutput({
                        teamOutputDocumentType: 'lab-resource',
                      }).$,
                  },
                  {
                    item: <>{protocol} Protocol</>,
                    href: network({})
                      .teams({})
                      .team({ teamId: selectedAssociation.id })
                      .createOutput({
                        teamOutputDocumentType: 'protocol',
                      }).$,
                  },
                ]),
          ]
        : [
            ...(user?.teams ?? [])
              .concat()
              .filter((team) => {
                const userRole = getUserRole(user, 'teams', [team.id]);
                return hasShareResearchOutputPermission(userRole);
              })
              .sort((a, b) =>
                (a.displayName ?? '').localeCompare(b.displayName ?? ''),
              )
              .map((team) => ({
                item: <AssociationItem association={team} />,
                closeOnClick: false,
                onClick: () => setSelectedAssociation(team),
              })),
            ...(user?.workingGroups ?? [])
              .concat()
              .filter((workingGroup) => {
                const userRole = getUserRole(user, 'workingGroups', [
                  workingGroup.id,
                ]);
                return hasShareResearchOutputPermission(userRole);
              })
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((wg) => ({
                item: <AssociationItem association={wg} />,
                closeOnClick: false,
                onClick: () => setSelectedAssociation(wg),
              })),
          ]}
    </DropdownButton>
  );
};

export default SharedOutputDropdown;
