import {
  ComplianceSortingDirection,
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptStatus,
  PartialManuscriptResponse,
  SortCompliance,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { Card, Pill } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, steel } from '../colors';
import { rem } from '../pixels';
import APCCoverageModal, { APCCoverageFormData } from './APCCoverageModal';
import ComplianceAssignUsersModal, {
  AssignedUsersFormData,
} from './ComplianceAssignUsersModal';
import ComplianceTableRow from './ComplianceTableRow';
import ConfirmStatusChangeModal from './ConfirmStatusChangeModal';

const container = css({
  overflowX: 'auto',
  borderRadius: rem(borderRadius),
  table: {
    borderSpacing: 0,
    width: '100%',
    minWidth: 'max-content',
  },
  'th, td': {
    textAlign: 'left',
    borderBottom: `1px solid ${steel.rgb}`,
    paddingRight: rem(32),
    ':nth-of-type(2)': {
      paddingLeft: rem(32),
    },
  },
  'th.sticky, td.sticky': {
    borderRight: `1px solid ${steel.rgb}`,
    position: 'sticky',
    paddingLeft: rem(24),
    left: 0,
  },
});

const pillIdStyles = css({
  marginLeft: '7px',
  display: 'block',
});

const titleStyles = css({
  alignItems: 'center',
  fontWeight: 'bold',
  color: charcoal.rgb,
  background: '#fff',
  verticalAlign: 'top',
  paddingTop: rem(32),
  paddingBottom: rem(16),
});

type ComplianceTableProps = Pick<
  ComponentProps<typeof ComplianceTableRow>,
  'getAssignedUsersSuggestions' | 'isComplianceReviewer'
> & {
  data: PartialManuscriptResponse[];
  onUpdateManuscript: (
    manuscriptId: string,
    payload: ManuscriptPutRequest,
  ) => Promise<ManuscriptResponse>;
  sort?: SortCompliance;
  setSort?: React.Dispatch<React.SetStateAction<SortCompliance>>;
  sortingDirection?: ComplianceSortingDirection;
  setSortingDirection?: React.Dispatch<
    React.SetStateAction<ComplianceSortingDirection>
  >;
};

const ComplianceTable: React.FC<ComplianceTableProps> = ({
  isComplianceReviewer,
  onUpdateManuscript,
  data,
  getAssignedUsersSuggestions,
}) => {
  const [displayConfirmStatusChangeModal, setDisplayConfirmStatusChangeModal] =
    useState(false);
  const [displayAssignUsersModal, setDisplayAssignUsersModal] = useState(false);
  const [displaySubmitAPCModal, setDisplaySubmitAPCModal] = useState(false);
  const [newSelectedStatus, setNewSelectedStatus] =
    useState<ManuscriptStatus>();
  const [manuscriptDetails, setManuscriptDetails] =
    useState<PartialManuscriptResponse>();

  const handleAssignUsersClick = (manuscript: PartialManuscriptResponse) => {
    setManuscriptDetails(manuscript);
    setDisplayAssignUsersModal(true);
  };

  const handleUpdateAPCDetailsClick = (
    manuscript: PartialManuscriptResponse,
  ) => {
    setManuscriptDetails(manuscript);
    setDisplaySubmitAPCModal(true);
  };

  const handleStatusClick = (
    statusItem: ManuscriptStatus,
    manuscript: PartialManuscriptResponse,
  ) => {
    if (statusItem !== manuscript.status) {
      setManuscriptDetails(manuscript);
      setNewSelectedStatus(statusItem);
      setDisplayConfirmStatusChangeModal(true);
    }
  };

  const handleStatusChange = async () => {
    if (newSelectedStatus && manuscriptDetails) {
      await onUpdateManuscript(manuscriptDetails.id, {
        status: newSelectedStatus,
      });
      setManuscriptDetails(undefined);
    }
  };

  const handleAssignUsersConfirm = async (
    assignedUsersData: AssignedUsersFormData,
  ) => {
    if (manuscriptDetails) {
      await onUpdateManuscript(manuscriptDetails.id, {
        assignedUsers: assignedUsersData.assignedUsers.map(
          (user) => user.value,
        ),
      });
      setDisplayAssignUsersModal(false);
    }
  };

  const handleAPCDetailsUpdate = async (
    apcCoverageData: APCCoverageFormData,
  ) => {
    if (manuscriptDetails) {
      await onUpdateManuscript(manuscriptDetails.id, {
        ...apcCoverageData,
        apcRequested: apcCoverageData.apcRequested === 'Requested',
        apcAmountRequested: apcCoverageData.apcAmountRequested
          ? Number(apcCoverageData.apcAmountRequested)
          : undefined,
        apcAmountPaid: apcCoverageData.apcAmountPaid
          ? Number(apcCoverageData.apcAmountPaid)
          : undefined,
      });
      setDisplaySubmitAPCModal(false);
    }
  };

  const PillId = () => (
    <Pill accent="blue" numberOfLines={1}>
      <span css={pillIdStyles}>{manuscriptDetails?.manuscriptId}</span>
    </Pill>
  );

  return (
    <Card padding={false}>
      {displayConfirmStatusChangeModal && newSelectedStatus && (
        <ConfirmStatusChangeModal
          onDismiss={() => setDisplayConfirmStatusChangeModal(false)}
          onConfirm={handleStatusChange}
          newStatus={newSelectedStatus}
        />
      )}
      {displayAssignUsersModal && manuscriptDetails && (
        <ComplianceAssignUsersModal
          onDismiss={() => setDisplayAssignUsersModal(false)}
          onConfirm={handleAssignUsersConfirm}
          PillId={PillId}
          teams={manuscriptDetails.teams ?? ''}
          manuscriptTitle={manuscriptDetails.title}
          getAssignedUsersSuggestions={getAssignedUsersSuggestions}
          assignedUsers={manuscriptDetails.assignedUsers.map((user) => ({
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
      {displaySubmitAPCModal && manuscriptDetails && (
        <APCCoverageModal
          onDismiss={() => setDisplaySubmitAPCModal(false)}
          onConfirm={handleAPCDetailsUpdate}
          apcRequested={manuscriptDetails.apcRequested}
          apcAmountRequested={manuscriptDetails.apcAmountRequested}
          apcCoverageRequestStatus={manuscriptDetails.apcCoverageRequestStatus}
          apcAmountPaid={manuscriptDetails.apcAmountPaid}
          declinedReason={manuscriptDetails.declinedReason}
        />
      )}
      <div css={container}>
        <table>
          <thead>
            <tr>
              <th css={titleStyles} className={'sticky'}>
                ID
              </th>
              <th css={titleStyles}>Team</th>
              <th css={titleStyles}>Last Updated</th>
              <th css={titleStyles}>Status</th>
              <th css={titleStyles}>
                APC <br />
                Coverage
              </th>
              <th css={titleStyles}>Assigned Users</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <ComplianceTableRow
                key={`${row.id}-${row.status}`}
                data={row}
                isComplianceReviewer={isComplianceReviewer}
                getAssignedUsersSuggestions={getAssignedUsersSuggestions}
                handleAssignUsersClick={handleAssignUsersClick}
                handleUpdateAPCDetailsClick={handleUpdateAPCDetailsClick}
                handleStatusClick={handleStatusClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ComplianceTable;
