import { User } from '@asap-hub/auth';
import {
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptStatus,
  manuscriptStatus,
  TeamManuscript,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  colors,
  complianceReportIcon,
  minusRectIcon,
  plusRectIcon,
  StatusButton,
  StatusType,
  Subtitle,
} from '..';
import { mobileScreen, perRem, rem } from '../pixels';
import ConfirmStatusChangeModal from './ConfirmStatusChangeModal';
import ManuscriptVersionCard from './ManuscriptVersionCard';

type ManuscriptCardProps = Pick<
  TeamManuscript,
  'id' | 'title' | 'versions' | 'status' | 'count'
> &
  Pick<
    ComponentProps<typeof ManuscriptVersionCard>,
    'onReplyToDiscussion' | 'getDiscussion'
  > & {
    user: User | null;
    teamId: string;
    teamIdCode: string;
    grantId: string;
    isComplianceReviewer: boolean;
    onUpdateManuscript: (
      manuscriptId: string,
      payload: ManuscriptPutRequest,
    ) => Promise<ManuscriptResponse>;
  };

const manuscriptContainerStyles = css({
  marginTop: rem(12),
  border: `1px solid ${colors.steel.rgb}`,
  borderRadius: `${rem(8)}`,
  boxSizing: 'border-box',
  width: '100%',
  borderWidth: 1,
  borderStyle: 'solid',
  display: 'block',
});

const toastStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${15 / perRem}em ${24 / perRem}em`,
  borderRadius: `${rem(8)} ${rem(8)} 0 0`,
  backgroundColor: colors.pearl.rgb,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${12 / perRem}em`,
});

const toastHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    alignItems: 'flex-start',
  },
});

const buttonsContainerStyles = css({
  display: 'flex',
  gap: `${16 / perRem}em`,
});

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({
  id,
  title,
  versions,
  count,
  status,
  teamId,
  teamIdCode,
  grantId,
  isComplianceReviewer,
  onUpdateManuscript,
  getDiscussion,
  onReplyToDiscussion,
  user,
}) => {
  const [displayConfirmStatusChangeModal, setDisplayConfirmStatusChangeModal] =
    useState(false);

  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status || '');
  const [newSelectedStatus, setNewSelectedStatus] =
    useState<ManuscriptStatus>();
  const history = useHistory();

  const complianceReportRoute = network({})
    .teams({})
    .team({ teamId })
    .workspace({})
    .createComplianceReport({ manuscriptId: id }).$;

  const handleShareComplianceReport = () => {
    history.push(complianceReportRoute);
  };

  const handleStatusClick = (statusItem: ManuscriptStatus) => {
    if (statusItem !== selectedStatus) {
      setDisplayConfirmStatusChangeModal(true);
    }
  };

  const closedManuscriptStatuses = ['Closed (other)', 'Compliant'];
  const canSubmitComplianceReport =
    !closedManuscriptStatuses.includes(status ?? '') &&
    !versions[0]?.complianceReport;

  const handleStatusChange = async () => {
    if (newSelectedStatus) {
      await onUpdateManuscript(id, { status: newSelectedStatus });
      setSelectedStatus(newSelectedStatus);
    }
  };

  const getReviewerStatusType = (
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

  return (
    <>
      {displayConfirmStatusChangeModal && newSelectedStatus && (
        <ConfirmStatusChangeModal
          onDismiss={() => setDisplayConfirmStatusChangeModal(false)}
          onConfirm={handleStatusChange}
          newStatus={newSelectedStatus}
        />
      )}
      <div css={manuscriptContainerStyles}>
        <div
          css={[
            {
              borderBottom: expanded ? `1px solid ${colors.steel.rgb}` : 'none',
            },
            toastStyles,
          ]}
        >
          <span css={toastHeaderStyles}>
            <span css={[iconStyles]}>
              <Button
                data-testid="collapsible-button"
                linkStyle
                onClick={() => setExpanded(!expanded)}
              >
                <span>{expanded ? minusRectIcon : plusRectIcon}</span>
              </Button>
            </span>
            <Subtitle noMargin>{title}</Subtitle>
          </span>
          <span css={buttonsContainerStyles}>
            <StatusButton
              buttonChildren={() => <span>{selectedStatus}</span>}
              canEdit={
                isComplianceReviewer &&
                !closedManuscriptStatuses.includes(selectedStatus)
              }
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
            {isComplianceReviewer && (
              <span>
                <Button
                  primary
                  small
                  noMargin
                  onClick={handleShareComplianceReport}
                  enabled={canSubmitComplianceReport}
                >
                  <span css={{ '> svg': { stroke: 'none' }, height: rem(24) }}>
                    {complianceReportIcon}
                  </span>
                </Button>
              </span>
            )}
          </span>
        </div>

        {expanded && (
          <div>
            {versions.map((version, index) => (
              <ManuscriptVersionCard
                onReplyToDiscussion={onReplyToDiscussion}
                getDiscussion={getDiscussion}
                key={index}
                version={version}
                teamId={teamId}
                teamIdCode={teamIdCode}
                grantId={grantId}
                manuscriptCount={count}
                manuscriptId={id}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManuscriptCard;
