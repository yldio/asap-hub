import {
  ManuscriptStatus,
  manuscriptStatus,
  PartialManuscriptResponse,
  statusButtonOptions,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import {
  addUserIcon,
  AssignedUsersAvatarList,
  AuthorSelect,
  lead,
  neutral200,
  PencilIcon,
  StatusButton,
  steel,
} from '..';
import { Button, Link, Pill } from '../atoms';
import { borderRadius } from '../card';
import { formatDateToTimezone } from '../date';
import { rem } from '../pixels';
import { getReviewerStatusType } from '../utils';

const rowStyles = css({
  padding: `${rem(20)} ${rem(24)} 0`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':first-of-type': {
    borderBottom: 'none',
  },
  ':nth-of-type(even) td': {
    background: neutral200.rgb,
  },
  ':nth-of-type(odd) td': {
    background: '#fff',
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    borderRadius: rem(borderRadius),
    td: {
      paddingBottom: rem(16),
    },
  },
  paddingTop: 0,
  paddingBottom: 0,
});

const apcCoverageStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: rem(14),
  color: lead.rgb,
});

const assignedUsersContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  maxWidth: rem(160),
  alignItems: 'center',
});

const assignedUsersInnerContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  gap: rem(8),
});

const noUsersStyles = css({
  display: 'flex',
  fontStyle: 'italic',
  fontSize: rem(14),
  color: lead.rgb,
  width: '100%',
  maxWidth: rem(90),
});

const assignUsersButtonStyles = css({
  display: 'flex',
  alignSelf: 'center',
  flexGrow: 0,
  height: rem(40),
  width: rem(40),
});

const editUsersButtonStyles = css({
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
});

const pillIdStyles = css({
  marginLeft: '7px',
  display: 'block',
});

const statusButtonContainerStyles = css({
  margin: `${rem(17)} 0`,
  fontSize: rem(14),
});

const teamLinkStyles = css({
  display: 'flex',
  gap: rem(3),
});

type ComplianceTableRowProps = {
  isComplianceReviewer: boolean;
  data: PartialManuscriptResponse;
  getAssignedUsersSuggestions: NonNullable<
    ComponentProps<typeof AuthorSelect>['loadOptions']
  >;
  handleStatusClick: (
    statusItem: ManuscriptStatus,
    manuscript: PartialManuscriptResponse,
  ) => void;
  handleAssignUsersClick: (manuscript: PartialManuscriptResponse) => void;
};

const completeStatuses = ['Closed (other)', 'Compliant'];

const ComplianceTableRow: React.FC<ComplianceTableRowProps> = ({
  isComplianceReviewer,
  data,
  handleAssignUsersClick,
  handleStatusClick,
}) => {
  const {
    team,
    manuscriptId,
    lastUpdated,
    status,
    requestingApcCoverage,
    assignedUsers,
  } = data;

  const canEdit =
    !completeStatuses.includes(status ?? '') && isComplianceReviewer;

  return (
    <>
      <tr
        key={manuscriptId}
        css={[rowStyles]}
        data-testid="compliance-table-row"
      >
        <td className={'sticky'}>
          <Pill accent="blue" numberOfLines={1}>
            <span css={pillIdStyles}>{manuscriptId}</span>
          </Pill>
        </td>
        <td>
          <p css={teamLinkStyles}>
            <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
              {team.displayName}
            </Link>
          </p>
        </td>
        <td>
          {lastUpdated &&
            formatDateToTimezone(lastUpdated, 'E, d MMM y').toUpperCase()}
        </td>
        <td css={statusButtonContainerStyles}>
          <StatusButton
            buttonChildren={() => <span>{status}</span>}
            canEdit={canEdit}
            selectedStatusType={getReviewerStatusType(
              status as (typeof manuscriptStatus)[number],
            )}
            wrap
          >
            {statusButtonOptions.map((statusItem) => ({
              item: statusItem,
              type: getReviewerStatusType(statusItem),
              onClick: () => {
                handleStatusClick(statusItem, data);
              },
            }))}
          </StatusButton>
        </td>
        <td>
          <p css={apcCoverageStyles}>{requestingApcCoverage ?? ''}</p>
        </td>
        <td>
          <div css={assignedUsersContainerStyles}>
            {assignedUsers?.length ? (
              <div css={assignedUsersInnerContainerStyles}>
                <AssignedUsersAvatarList members={assignedUsers} />
                {canEdit ? (
                  <Button
                    aria-label="Edit Assigned Users"
                    noMargin
                    onClick={() => handleAssignUsersClick(data)}
                    overrideStyles={css([
                      assignUsersButtonStyles,
                      editUsersButtonStyles,
                    ])}
                  >
                    <PencilIcon />
                  </Button>
                ) : null}
              </div>
            ) : (
              <div css={assignedUsersInnerContainerStyles}>
                <span css={noUsersStyles}>No users assigned</span>
                {canEdit ? (
                  <Button
                    aria-label="Assign Users"
                    noMargin
                    small
                    overrideStyles={assignUsersButtonStyles}
                    onClick={() => handleAssignUsersClick(data)}
                  >
                    {addUserIcon}
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default ComplianceTableRow;
