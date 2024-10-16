import { TeamManuscript, manuscriptStatus } from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  colors,
  StatusButton,
  complianceReportIcon,
  minusRectIcon,
  plusRectIcon,
  Subtitle,
} from '..';
import { mobileScreen, perRem, rem } from '../pixels';
import ManuscriptVersionCard from './ManuscriptVersionCard';

type ManuscriptCardProps = Pick<
  TeamManuscript,
  'id' | 'title' | 'versions' | 'status'
> & {
  teamId: string;
  canShareComplianceReport: boolean;
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
  status,
  teamId,
  canShareComplianceReport,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status || '');
  const canEditStatus = useCurrentUserCRN()?.role === 'Staff';
  const history = useHistory();

  const complianceReportRoute = network({})
    .teams({})
    .team({ teamId })
    .workspace({})
    .createComplianceReport({ manuscriptId: id }).$;

  const handleShareComplianceReport = () => {
    history.push(complianceReportRoute);
  };

  const hasActiveComplianceReport = !!versions[0]?.complianceReport;

  return (
    <div css={manuscriptContainerStyles}>
      <div
        css={[
          { borderBottom: expanded ? `1px solid ${colors.steel.rgb}` : 'none' },
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
            canEdit={canEditStatus}
          >
            {manuscriptStatus.map((statusItem) => ({
              item: statusItem,
              onClick: () => {
                setSelectedStatus(statusItem);
              },
            }))}
          </StatusButton>
          {canShareComplianceReport && (
            <span>
              <Button
                primary
                small
                noMargin
                onClick={handleShareComplianceReport}
                enabled={!hasActiveComplianceReport}
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
            <ManuscriptVersionCard {...version} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManuscriptCard;
