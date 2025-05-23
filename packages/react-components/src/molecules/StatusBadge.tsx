import React from 'react';
import { css } from '@emotion/react';
import { ManuscriptStatus } from '@asap-hub/model';
import { perRem } from '../pixels';
import {
  info100,
  info500,
  warning100,
  warning500,
  success100,
  success500,
} from '../colors';
import { statusIcon, StatusType } from './StatusButton';
import { getReviewerStatusType } from '../utils';

type StatusBadgeProps = {
  status: ManuscriptStatus;
};

const getStatusBadgeStyles = (type: StatusType) => {
  const bgColor =
    type === 'warning'
      ? warning100.rgba
      : type === 'final'
        ? success100.rgba
        : info100.rgba;

  const textColor =
    type === 'warning'
      ? warning500.rgba
      : type === 'final'
        ? success500.rgba
        : info500.rgba;

  const iconFill = type === 'warning' ? warning500.rgba : undefined;

  return css({
    backgroundColor: bgColor,
    color: textColor,
    padding: '0em 0.7em',
    borderRadius: `${24 / perRem}em`,
    fontSize: '0.9em',
    marginLeft: '0.1em',
    display: 'flex',
    alignItems: 'center',
    gap: `${6 / perRem}rem`,
    '& svg': {
      width: `${16 / perRem}rem`,
      height: `${16 / perRem}rem`,
      margin: 0,
      '& > g > path': {
        fill: iconFill,
      },
    },
  });
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const type = getReviewerStatusType(status);
  return (
    <span css={getStatusBadgeStyles(type)}>
      {statusIcon(type, true)}
      {status}
    </span>
  );
};

export default StatusBadge;
