import { manuscriptStatus, ManuscriptStatus } from '@asap-hub/model';
import { css } from '@emotion/react';

import {
  info100,
  info200,
  info500,
  lead,
  StatusType,
  steel,
  success100,
  success500,
  warning100,
  warning150,
  warning500,
} from '..';
import { Card, Paragraph } from '../atoms';
import { iconStyles, statusIcon } from '../molecules/StatusButton';
import { rem } from '../pixels';
import { getReviewerStatusType } from './ManuscriptCard';

const cardStyles = css({
  marginTop: rem(32),
});

const statusDescriptionStyles = css({
  fontWeight: 'bold',
  marginBottom: rem(16),
});

const manuscriptStatusContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '16px 8px',
  justifyItems: 'start',
});

const getbuttonStyles = (type: StatusType, isSelected: boolean) => {
  const getBackgroundColor = () => {
    if (!isSelected) {
      return 'white';
    }
    if (type === 'warning') {
      return warning100.rgb;
    }

    if (type === 'final') {
      return success100.rgb;
    }

    return info100.rgb;
  };

  const getBorderColor = () => {
    if (type === 'warning') {
      return warning150.rgb;
    }

    if (type === 'final') {
      return info200.rgb;
    }

    return isSelected ? info500.rgb : steel.rgb;
  };

  const getColor = () => {
    if (type === 'warning') {
      return warning500.rgb;
    }
    if (type === 'final') {
      return success500.rgb;
    }

    return isSelected ? info500.rgb : lead.rgb;
  };

  return css({
    paddingLeft: type === 'warning' || type === 'final' ? '12px' : '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: getBackgroundColor(),
    borderStyle: 'solid',
    borderWidth: '1px !important',
    borderColor: getBorderColor(),
    borderRadius: '24px',
    color: getColor(),
    gap: '4px',
  });
};

const buttonTextStyles = css({
  fontWeight: 400,
  fontSize: rem(17),
  lineHeight: rem(24),
});

type ManuscriptByStatusProps = {
  isComplianceReviewer: boolean;
  selectedStatuses: ManuscriptStatus[];
  onSelectStatus: (status: ManuscriptStatus) => void;
  shouldHideCompleteStatus: boolean;
};
const ManuscriptByStatus: React.FC<ManuscriptByStatusProps> = ({
  isComplianceReviewer,
  selectedStatuses,
  onSelectStatus,
  shouldHideCompleteStatus,
}) => {
  const manuscriptList = shouldHideCompleteStatus
    ? manuscriptStatus.filter(
        (status) => status !== 'Compliant' && status !== 'Closed (other)',
      )
    : manuscriptStatus;
  return (
    <Card overrideStyles={cardStyles}>
      <div css={statusDescriptionStyles}>
        <Paragraph>Manuscripts by status:</Paragraph>
      </div>
      <div css={manuscriptStatusContainerStyles}>
        {manuscriptList.map((status, index) => {
          const isSelected = selectedStatuses.includes(status);

          const type = getReviewerStatusType(
            status as (typeof manuscriptStatus)[number],
          );
          const hasIcon = ['warning', 'final'].includes(type);

          const buttonStyles = getbuttonStyles(type, isSelected);

          return (
            <button
              key={index}
              css={buttonStyles}
              onClick={() => onSelectStatus(status)}
            >
              {hasIcon && (
                <span css={iconStyles(type, isComplianceReviewer)}>
                  {statusIcon(type, isComplianceReviewer)}
                </span>
              )}
              <span css={buttonTextStyles}>{status}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default ManuscriptByStatus;
