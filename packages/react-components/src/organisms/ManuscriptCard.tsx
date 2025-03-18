import { User } from '@asap-hub/auth';
import {
  AuthorResponse,
  ManuscriptDataObject,
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptStatus,
  manuscriptStatus,
  ManuscriptVersion,
  TeamManuscript,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css, Theme } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  charcoal,
  colors,
  complianceReportIcon,
  fern,
  minusRectIcon,
  neutral900,
  plusRectIcon,
  resubmitManuscriptIcon,
  StatusButton,
  StatusType,
  Subtitle,
} from '..';
import { mobileScreen, perRem, rem, smallDesktopScreen } from '../pixels';
import ConfirmStatusChangeModal from './ConfirmStatusChangeModal';
import ManuscriptVersionCard from './ManuscriptVersionCard';

type ManuscriptCardProps = Pick<TeamManuscript, 'id'> &
  Pick<
    ComponentProps<typeof ManuscriptVersionCard>,
    'onSave' | 'getDiscussion'
  > & {
    user: User | null;
    teamId: string;
    isComplianceReviewer: boolean;
    isActiveTeam: boolean;
    onUpdateManuscript: (
      manuscriptId: string,
      payload: ManuscriptPutRequest,
    ) => Promise<ManuscriptResponse>;
    createComplianceDiscussion: (
      complianceReportId: string,
      message: string,
    ) => Promise<string>;
    useVersionById: (args: {
      teamId: string;
      manuscriptId: string;
      versionId: string;
    }) => [
      ManuscriptVersion | undefined,
      (callback: (prev: ManuscriptVersion) => ManuscriptVersion) => void,
    ];
    onEndDiscussion: (id: string) => Promise<void>;
    useManuscriptById: (
      id: string,
    ) => [
      ManuscriptDataObject | undefined,
      React.Dispatch<React.SetStateAction<ManuscriptDataObject | undefined>>,
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

const tabButtonStyles = ({ colors: { primary500 = fern } = {} }: Theme) =>
  css({
    paddingLeft: rem(0),
    paddingRight: rem(0),
    paddingBottom: rem(20),
    color: neutral900.rgb,
    backgroundColor: 'transparent',
    border: 'none',
    '&.active': {
      paddingBottom: rem(16),
      color: charcoal.rgb,
      fontWeight: 'bold',
      borderBottom: `${rem(4)} solid ${primary500.rgba}`,
    },
  });

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

const isManuscriptLabPi = ({
  labs,
  user,
}: {
  labs: ManuscriptVersion['labs'] | undefined;
  user: User | null;
}) => user && labs && labs.some((lab) => lab.labPi === user.id);

const canUpdateManuscript = ({ version, user }: VersionUserProps) =>
  !!isManuscriptLead({ version, user }) ||
  !!isManuscriptAuthor({
    authors: [
      ...(version?.firstAuthors || []),
      ...(version?.correspondingAuthor || []),
      ...(version?.additionalAuthors || []),
    ],
    user,
  }) ||
  !!isManuscriptLabPi({ labs: version?.labs, user });

export const closedManuscriptStatuses = ['Closed (other)', 'Compliant'];

export const getReviewerStatusType = (
  statusItem: (typeof manuscriptStatus)[number],
): StatusType =>
  (
    ({
      [manuscriptStatus[0]]: 'warning',
      [manuscriptStatus[1]]: 'default',
      [manuscriptStatus[2]]: 'warning',
      [manuscriptStatus[3]]: 'default',
      [manuscriptStatus[4]]: 'default',
      [manuscriptStatus[5]]: 'final',
      [manuscriptStatus[6]]: 'final',
    }) as Record<string, StatusType>
  )[statusItem] || 'none';

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({
  id,
  teamId,
  isComplianceReviewer,
  isActiveTeam,
  onUpdateManuscript,
  getDiscussion,
  onSave,
  user,
  createComplianceDiscussion,
  useVersionById,
  onEndDiscussion,
  useManuscriptById,
}) => {
  const [activeTab, setActiveTab] = useState<
    'manuscripts-and-reports' | 'discussions'
  >('manuscripts-and-reports');
  const [manuscript, setManuscript] = useManuscriptById(id);
  const { title, status, versions } = manuscript ?? { versions: [] };
  const [displayConfirmStatusChangeModal, setDisplayConfirmStatusChangeModal] =
    useState(false);

  const [expanded, setExpanded] = useState(false);
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
    if (statusItem !== status) {
      setNewSelectedStatus(statusItem);
      setDisplayConfirmStatusChangeModal(true);
    }
  };

  const currentManuscriptVersion = versions[0];

  const canSubmitComplianceReport =
    !closedManuscriptStatuses.includes(status ?? '') &&
    !currentManuscriptVersion?.complianceReport;

  const hasUpdateAccess = canUpdateManuscript({
    version: currentManuscriptVersion,
    user,
  });
  const isActiveManuscript =
    !closedManuscriptStatuses.includes(status ?? '') && isActiveTeam;

  const handleStatusChange = async () => {
    if (newSelectedStatus) {
      const updatedManuscript = await onUpdateManuscript(id, {
        status: newSelectedStatus,
      });
      setManuscript(updatedManuscript);
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
                buttonChildren={() => <span>{status}</span>}
                canEdit={isComplianceReviewer && isActiveManuscript}
                selectedStatusType={getReviewerStatusType(
                  status as (typeof manuscriptStatus)[number],
                )}
              >
                {manuscriptStatus.map((statusItem) => ({
                  item: statusItem,
                  type: getReviewerStatusType(statusItem),
                  onClick: () => {
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
            <div
              style={{
                display: 'flex',
                gap: rem(32),
                marginLeft: rem(60),
                marginBottom: rem(16),
                marginTop: rem(12),
              }}
            >
              <button
                className={
                  activeTab === 'manuscripts-and-reports' ? 'active' : ''
                }
                css={tabButtonStyles}
                onClick={() => setActiveTab('manuscripts-and-reports')}
              >
                Manuscripts and Reports
              </button>
              <button
                className={activeTab === 'discussions' ? 'active' : ''}
                css={tabButtonStyles}
                onClick={() => setActiveTab('discussions')}
              >
                Discussions
              </button>
            </div>

            {activeTab === 'manuscripts-and-reports' &&
              versions.map((version, index) => (
                <ManuscriptVersionCard
                  onSave={onSave}
                  getDiscussion={getDiscussion}
                  key={index}
                  version={version}
                  teamId={teamId}
                  manuscriptId={id}
                  isActiveVersion={
                    isActiveManuscript &&
                    version.id === currentManuscriptVersion?.id
                  }
                  createComplianceDiscussion={createComplianceDiscussion}
                  useVersionById={useVersionById}
                  onEndDiscussion={onEndDiscussion}
                  isComplianceReviewer={isComplianceReviewer}
                  isManuscriptContributor={hasUpdateAccess}
                />
              ))}
            {activeTab === 'discussions' && (
              <div css={css({ margin: `${rem(12)} ${rem(60)}` })}>
                <h2>Discussions</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ManuscriptCard;
