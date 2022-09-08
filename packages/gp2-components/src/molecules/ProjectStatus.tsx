import { gp2 } from '@asap-hub/model';
import { Pill } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import colors from '../templates/colors';

type ProjectStatusProps = Pick<gp2.ProjectResponse, 'status'>;

export const statusStyles: Record<
  gp2.ProjectResponse['status'],
  { color: string; borderColor: string; backgroundColor: string }
> = {
  Active: {
    color: colors.info900.rgba,
    borderColor: colors.info900.rgba,
    backgroundColor: colors.info100.rgba,
  },
  Completed: {
    color: colors.secondary900.rgba,
    borderColor: colors.secondary900.rgba,
    backgroundColor: colors.secondary100.rgba,
  },
  Inactive: {
    color: colors.warning900.rgba,
    borderColor: colors.warning900.rgba,
    backgroundColor: colors.warning100.rgba,
  },
};

const ProjectStatus: React.FC<ProjectStatusProps> = ({ status }) => (
  <Pill overrideStyles={css({ ...statusStyles[status], margin: 0 })}>
    {status}
  </Pill>
);

export default ProjectStatus;
