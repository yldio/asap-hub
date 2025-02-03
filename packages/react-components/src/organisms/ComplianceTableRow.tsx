import {
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptStatus,
  manuscriptStatus,
  PartialManuscriptResponse,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps, useState } from 'react';
import {
  addUserIcon,
  AuthorSelect,
  charcoal,
  lead,
  neutral200,
  PencilIcon,
  StatusButton,
  steel,
  UserAvatarList,
} from '..';
import { Button, Link, Pill } from '../atoms';
import { borderRadius } from '../card';
import { formatDateToTimezone } from '../date';
import { rem, tabletScreen } from '../pixels';
import ComplianceAssignUsersModal, {
  AssignedUsersFormData,
} from './ComplianceAssignUsersModal';
import ConfirmStatusChangeModal from './ConfirmStatusChangeModal';
import { getReviewerStatusType } from './ManuscriptCard';

const rowTitleStyles = css({
  paddingTop: rem(32),
  paddingBottom: rem(16),
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const rowStyles = css({
  display: 'grid',
  padding: `${rem(20)} ${rem(24)} 0`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':first-of-type': {
    borderBottom: 'none',
  },
  ':nth-of-type(2n+3)': {
    background: neutral200.rgb,
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: rem(15),
    borderRadius: rem(borderRadius),
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '0.5fr 0.7fr 0.7fr 1fr 0.5fr 1fr',
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  color: charcoal.rgb,
  gap: rem(8),
});

const teamNameStyles = css({
  display: 'flex',
  gap: rem(3),
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

type ComplianceTableRowProps = {
  isComplianceReviewer: boolean;
  data: PartialManuscriptResponse;
  onUpdateManuscript: (
    manuscriptId: string,
    payload: ManuscriptPutRequest,
  ) => Promise<ManuscriptResponse>;
  getAuthorSuggestions: NonNullable<
    ComponentProps<typeof AuthorSelect>['loadOptions']
  >;
};

const ComplianceTableRow: React.FC<ComplianceTableRowProps> = ({
  isComplianceReviewer,
  data,
  onUpdateManuscript,
  getAuthorSuggestions,
}) => {
  const [displayConfirmStatusChangeModal, setDisplayConfirmStatusChangeModal] =
    useState(false);
  const [displayAssignUsersModal, setDisplayAssignUsersModal] = useState(false);
  const {
    manuscriptId,
    team,
    id,
    lastUpdated,
    status,
    requestingApcCoverage,
    assignedUsers,
    title,
    teams,
  } = data;
  const [newSelectedStatus, setNewSelectedStatus] =
    useState<ManuscriptStatus>();

  const handleAssignUsersClick = () => {
    setDisplayAssignUsersModal(true);
  };

  const handleStatusClick = (statusItem: ManuscriptStatus) => {
    if (statusItem !== status) {
      setDisplayConfirmStatusChangeModal(true);
    }
  };

  const handleStatusChange = async () => {
    if (newSelectedStatus) {
      await onUpdateManuscript(manuscriptId, {
        status: newSelectedStatus,
      });
      setNewSelectedStatus(newSelectedStatus);
    }
  };

  const handleAssignUsersConfirm = async (
    assignedUsersData: AssignedUsersFormData,
  ) => {
    await onUpdateManuscript(manuscriptId, {
      assignedUsers: assignedUsersData.assignedUsers.map((user) => user.value),
    });
    setDisplayAssignUsersModal(false);
  };

  const PillId = () => (
    <Pill accent="blue" numberOfLines={3}>
      <span css={{ marginLeft: '7px', display: 'block' }}>{id}</span>
    </Pill>
  );

  return (
    <>
      {displayConfirmStatusChangeModal && newSelectedStatus && (
        <ConfirmStatusChangeModal
          onDismiss={() => setDisplayConfirmStatusChangeModal(false)}
          onConfirm={handleStatusChange}
          newStatus={newSelectedStatus}
        />
      )}
      {displayAssignUsersModal && (
        <ComplianceAssignUsersModal
          onDismiss={() => setDisplayAssignUsersModal(false)}
          onConfirm={handleAssignUsersConfirm}
          PillId={PillId}
          teams={teams ?? ''}
          apcCoverage={requestingApcCoverage ?? ''}
          manuscriptTitle={title}
          getAuthorSuggestions={getAuthorSuggestions}
          assignedUsers={assignedUsers.map((user) => ({
            author: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              displayName: `${user.firstName} ${user.lastName}`,
              avatarUrl: user.avatarUrl,
            },
            label: `${user.firstName} ${user.lastName}`,
            value: user.id,
          }))}
        />
      )}
      <div key={id} css={[rowStyles]} data-testid="compliance-table-row">
        <span css={[titleStyles, rowTitleStyles]}>Team</span>
        <p css={teamNameStyles}>
          <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
            {team.displayName}
          </Link>
        </p>
        <span css={[titleStyles, rowTitleStyles]}>ID</span>
        <p>
          <PillId />
        </p>
        <span css={[titleStyles, rowTitleStyles]}>Last Updated</span>
        <p>
          {lastUpdated &&
            formatDateToTimezone(lastUpdated, 'E, d MMM y').toUpperCase()}
        </p>
        <span css={[titleStyles, rowTitleStyles]}>Status</span>
        <span css={{ margin: `${rem(17)} 0` }}>
          <StatusButton
            buttonChildren={() => <span>{status}</span>}
            canEdit={
              !['Closed (other)', 'Compliant'].includes(status ?? '') &&
              isComplianceReviewer
            }
            selectedStatusType={getReviewerStatusType(
              status as (typeof manuscriptStatus)[number],
            )}
            wrap
          >
            {manuscriptStatus.map((statusItem) => ({
              item: statusItem,
              type: getReviewerStatusType(statusItem),
              onClick: () => {
                setNewSelectedStatus(statusItem);
                handleStatusClick(statusItem);
              },
            }))}
          </StatusButton>
        </span>
        <span css={[titleStyles, rowTitleStyles]}>APC Coverage</span>
        <p>{requestingApcCoverage}</p>
        <span css={[titleStyles, rowTitleStyles]}>Assigned Users</span>
        <div css={assignedUsersContainerStyles}>
          {assignedUsers?.length ? (
            <div css={assignedUsersInnerContainerStyles}>
              <UserAvatarList members={assignedUsers} maxAvatars={2} />
              <Button
                aria-label="Edit Assigned Users"
                noMargin
                onClick={() => setDisplayAssignUsersModal(true)}
                overrideStyles={css([
                  assignUsersButtonStyles,
                  editUsersButtonStyles,
                ])}
              >
                <PencilIcon />
              </Button>
            </div>
          ) : (
            <div css={assignedUsersInnerContainerStyles}>
              <span css={noUsersStyles}>No users assigned</span>
              <Button
                aria-label="Assign Users"
                noMargin
                small
                overrideStyles={assignUsersButtonStyles}
                onClick={handleAssignUsersClick}
              >
                {addUserIcon}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ComplianceTableRow;
