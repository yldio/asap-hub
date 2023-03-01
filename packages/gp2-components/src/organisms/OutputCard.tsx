import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  Caption,
  Card,
  formatDate,
  Headline2,
  Link,
} from '@asap-hub/react-components';

import { IconWithLabel } from '../molecules';
import { projectIcon, workingGroupIcon } from '../icons';

type OutputCardProps = Pick<
  gp2Model.OutputResponse,
  'addedDate' | 'title' | 'workingGroups' | 'projects'
>;

const OutputCard: React.FC<OutputCardProps> = ({
  addedDate,
  title,
  workingGroups,
  projects,
}) => (
  <Card>
    <Headline2 styleAsHeading={4}>{title}</Headline2>
    {workingGroups && (
      <IconWithLabel icon={workingGroupIcon}>
        <Link
          href={
            gp2Routing
              .workingGroups({})
              .workingGroup({ workingGroupId: workingGroups.id }).$
          }
        >
          {workingGroups.title}
        </Link>
      </IconWithLabel>
    )}
    {projects && (
      <IconWithLabel icon={projectIcon}>
        <Link
          href={gp2Routing.projects({}).project({ projectId: projects.id }).$}
        >
          {projects.title}
        </Link>
      </IconWithLabel>
    )}
    <Caption accent={'lead'} asParagraph>
      Date Added: {formatDate(new Date(addedDate))}
    </Caption>
  </Card>
);

export default OutputCard;
