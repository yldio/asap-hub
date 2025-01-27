import {
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptStatus,
  manuscriptStatus,
  PartialManuscriptResponse,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { charcoal, neutral200, StatusButton, steel } from '..';
import { Avatar, Link, Pill } from '../atoms';
import { borderRadius } from '../card';
import { formatDateToTimezone } from '../date';
import { rem, tabletScreen } from '../pixels';
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

type ComplianceTableRowProps = {
  data: PartialManuscriptResponse;
  onUpdateManuscript: (
    manuscriptId: string,
    payload: ManuscriptPutRequest,
  ) => Promise<ManuscriptResponse>;
};

const ComplianceTableRow: React.FC<ComplianceTableRowProps> = ({
  data,
  onUpdateManuscript,
}) => {
  const [displayConfirmStatusChangeModal, setDisplayConfirmStatusChangeModal] =
    useState(false);
  const {
    manuscriptId,
    team,
    id,
    lastUpdated,
    status,
    requestingApcCoverage,
    assignedUsers,
  } = data;
  const [newSelectedStatus, setNewSelectedStatus] =
    useState<ManuscriptStatus>();
  const [selectedStatus, setSelectedStatus] = useState(status || '');

  const handleStatusClick = (statusItem: ManuscriptStatus) => {
    if (statusItem !== selectedStatus) {
      setDisplayConfirmStatusChangeModal(true);
    }
  };

  const handleStatusChange = async () => {
    if (newSelectedStatus) {
      await onUpdateManuscript(manuscriptId, {
        status: newSelectedStatus,
      });
      setSelectedStatus(newSelectedStatus);
    }
  };

  return (
    <>
      {displayConfirmStatusChangeModal && newSelectedStatus && (
        <ConfirmStatusChangeModal
          onDismiss={() => setDisplayConfirmStatusChangeModal(false)}
          onConfirm={handleStatusChange}
          newStatus={newSelectedStatus}
        />
      )}
      <div key={id} css={[rowStyles]}>
        <span css={[titleStyles, rowTitleStyles]}>Team</span>
        <p css={teamNameStyles}>
          <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
            {team.displayName}
          </Link>
        </p>
        <span css={[titleStyles, rowTitleStyles]}>ID</span>
        <p>
          <Pill accent="blue" numberOfLines={3}>
            <span css={{ marginLeft: '7px', display: 'block' }}>{id}</span>
          </Pill>
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
            canEdit={!['Closed (other)', 'Compliant'].includes(status ?? '')}
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
        <div css={{ width: rem(32), alignSelf: 'center' }}>
          {assignedUsers?.map((user) => (
            <Avatar
              firstName={user.firstName}
              lastName={user.lastName}
              imageUrl={user.avatarUrl}
              key={user.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ComplianceTableRow;
