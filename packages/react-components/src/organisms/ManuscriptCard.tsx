import { User } from '@asap-hub/auth';
import {
  AuthorResponse,
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptStatus,
  manuscriptStatus,
  ManuscriptVersion,
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
  resubmitManuscriptIcon,
  StatusButton,
  StatusType,
  Subtitle,
} from '..';
import { mobileScreen, perRem, rem, smallDesktopScreen } from '../pixels';
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
    isTeamMember: boolean;
    isActiveTeam: boolean;
    onUpdateManuscript: (
      manuscriptId: string,
      payload: ManuscriptPutRequest,
    ) => Promise<ManuscriptResponse>;
    createComplianceDiscussion: (
      message: string,
      complianceReportId: string,
      manuscriptId: string,
      versionId: string,
    ) => Promise<string>;
    useVersionById: (args: {
      teamId: string;
      manuscriptId: string;
      versionId: string;
    }) => [
      ManuscriptVersion | undefined,
      (callback: (prev: ManuscriptVersion) => ManuscriptVersion) => void,
    ];
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
  justifyContent: 'space-between',

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    alignItems: 'flex-start',
  },
});

const buttonsContainerStyles = css({
  display: 'flex',
  marginTop: rem(16),
  gap: rem(16),
  [`@media (max-width: ${smallDesktopScreen.max}px)`]: {
    flexDirection: 'column',
  },
});

const buttonStyles = css({
  '> svg': { stroke: 'none' },
  height: rem(24),
  display: 'flex',
  gap: rem(8),
});

export type VersionUserProps = {
  version:
    | Pick<
        ManuscriptVersion,
        | 'teams'
        | 'firstAuthors'
        | 'correspondingAuthor'
        | 'additionalAuthors'
        | 'labs'
      >
    | undefined;
  user: User | null;
};

export const isManuscriptLead = ({ version, user }: VersionUserProps) =>
  user &&
  version &&
  user.teams.find((team) =>
    version.teams.find(
      (versionTeam) =>
        versionTeam.id === team.id &&
        (team.role === 'Lead PI (Core Leadership)' ||
          team.role === 'Project Manager'),
    ),
  );

export const isManuscriptAuthor = ({
  authors,
  user,
}: {
  authors: AuthorResponse[];
  user: User | null;
}) => user && authors.find((author) => author.id === user.id);

const canUpdateManuscript = ({ version, user }: VersionUserProps) =>
  !!isManuscriptLead({ version, user }) ||
  !!isManuscriptAuthor({
    authors: [
      ...(version?.firstAuthors || []),
      ...(version?.correspondingAuthor || []),
      ...(version?.additionalAuthors || []),
    ],
    user,
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
  isTeamMember,
  isActiveTeam,
  onUpdateManuscript,
  getDiscussion,
  onReplyToDiscussion,
  user,
  createComplianceDiscussion,
  useVersionById,
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

  const resubmitManuscriptRoute = network({})
    .teams({})
    .team({ teamId })
    .workspace({})
    .resubmitManuscript({ manuscriptId: id }).$;

  const handleShareComplianceReport = () => {
    history.push(complianceReportRoute);
  };

  const handleResubmitManuscript = () => {
    history.push(resubmitManuscriptRoute);
  };

  const handleStatusClick = (statusItem: ManuscriptStatus) => {
    if (statusItem !== selectedStatus) {
      setDisplayConfirmStatusChangeModal(true);
    }
  };

  const closedManuscriptStatuses = ['Closed (other)', 'Compliant'];
  const currentManuscriptVersion = versions[0];

  const canSubmitComplianceReport =
    !closedManuscriptStatuses.includes(status ?? '') &&
    !currentManuscriptVersion?.complianceReport;

  const hasUpdateAccess = canUpdateManuscript({
    version: currentManuscriptVersion,
    user,
  });
  const isActiveManuscript =
    !closedManuscriptStatuses.includes(selectedStatus ?? '') && isActiveTeam;

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
          <span css={[iconStyles]}>
            <Button
              data-testid="collapsible-button"
              linkStyle
              onClick={() => setExpanded(!expanded)}
            >
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          </span>
          <span css={{ width: '100%' }}>
            <span css={toastHeaderStyles}>
              <Subtitle noMargin>{title}</Subtitle>
              <StatusButton
                buttonChildren={() => <span>{selectedStatus}</span>}
                canEdit={isComplianceReviewer && isActiveManuscript}
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
            </span>
            {isActiveManuscript && (
              <span css={buttonsContainerStyles}>
                {isComplianceReviewer && (
                  <span>
                    <Button
                      primary
                      small
                      noMargin
                      onClick={handleShareComplianceReport}
                      enabled={canSubmitComplianceReport}
                    >
                      <span css={buttonStyles}>
                        {complianceReportIcon} Share Compliance Report
                      </span>
                    </Button>
                  </span>
                )}
                {hasUpdateAccess && (
                  <span>
                    <Button
                      primary
                      small
                      noMargin
                      onClick={handleResubmitManuscript}
                      enabled={!!currentManuscriptVersion?.complianceReport}
                    >
                      <span css={buttonStyles}>
                        {resubmitManuscriptIcon} Submit Revised Manuscript
                      </span>
                    </Button>
                  </span>
                )}
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
                canEditManuscript={
                  hasUpdateAccess && version.id === currentManuscriptVersion?.id
                }
                isActiveManuscript={isActiveManuscript}
                isTeamMember={isTeamMember}
                createComplianceDiscussion={createComplianceDiscussion}
                useVersionById={useVersionById}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManuscriptCard;
