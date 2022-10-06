import { gp2 } from '@asap-hub/model';
import { Pill, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import colors from '../templates/colors';

const { rem } = pixels;
type StatusPillProps = {
  status:
    | gp2.ProjectResponse['status']
    | gp2.ProjectResponse['milestones'][0]['status'];
};

export const statusStyles: Record<
  | gp2.ProjectResponse['status']
  | gp2.ProjectResponse['milestones'][0]['status'],
  { color: string; borderColor: string }
> = {
  Active: {
    color: colors.info900.rgba,
    borderColor: colors.info900.rgba,
  },
  Completed: {
    color: colors.secondary900.rgba,
    borderColor: colors.secondary900.rgba,
  },
  Inactive: {
    color: colors.warning900.rgba,
    borderColor: colors.warning900.rgba,
  },
  'Not Started': {
    color: colors.error900.rgba,
    borderColor: colors.error900.rgba,
  },
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => (
  <Pill
    small={false}
    overrideStyles={css({
      ...statusStyles[status],
      margin: 0,
      fontSize: rem(14),
      padding: '4px 8px',
      lineHeight: rem(16),
    })}
  >
    {status}
  </Pill>
);
export default StatusPill;
