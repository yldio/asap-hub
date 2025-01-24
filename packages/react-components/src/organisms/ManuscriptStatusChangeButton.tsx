import {
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptStatus,
  manuscriptStatus,
} from '@asap-hub/model';
import { useState } from 'react';
import StatusButton, { StatusType } from '../molecules/StatusButton';
import ConfirmStatusChangeModal from './ConfirmStatusChangeModal';

interface ManuscriptStatusChangeButtonProps {
  canEdit: boolean;
  status: ManuscriptStatus;
  manuscriptId: string;
  onUpdateManuscript: (
    manuscriptId: string,
    payload: ManuscriptPutRequest,
  ) => Promise<ManuscriptResponse>;
}

export const getReviewerStatusType = (
  statusItem: (typeof manuscriptStatus)[number],
): StatusType =>
  (
    ({
      [manuscriptStatus[0]]: 'warning',
      [manuscriptStatus[1]]: 'default',
      [manuscriptStatus[2]]: 'warning',
      [manuscriptStatus[3]]: 'default',
      [manuscriptStatus[4]]: 'warning',
      [manuscriptStatus[5]]: 'default',
      [manuscriptStatus[6]]: 'warning',
      [manuscriptStatus[7]]: 'final',
      [manuscriptStatus[8]]: 'final',
    }) as Record<string, StatusType>
  )[statusItem] || 'none';

const ManuscriptStatusChangeButton: React.FC<
  ManuscriptStatusChangeButtonProps
> = ({ canEdit, status, manuscriptId, onUpdateManuscript }) => {
  const [selectedStatus, setSelectedStatus] = useState(status || '');
  const [newSelectedStatus, setNewSelectedStatus] =
    useState<ManuscriptStatus>();
  const [displayConfirmStatusChangeModal, setDisplayConfirmStatusChangeModal] =
    useState(false);

  const handleStatusClick = (statusItem: ManuscriptStatus) => {
    if (statusItem !== selectedStatus) {
      setDisplayConfirmStatusChangeModal(true);
    }
  };

  const handleStatusChange = async () => {
    if (newSelectedStatus) {
      await onUpdateManuscript(manuscriptId, { status: newSelectedStatus });
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
      <StatusButton
        buttonChildren={() => <span>{selectedStatus}</span>}
        canEdit={canEdit}
        selectedStatusType={getReviewerStatusType(
          selectedStatus as (typeof manuscriptStatus)[number],
        )}
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
    </>
  );
};

export default ManuscriptStatusChangeButton;
