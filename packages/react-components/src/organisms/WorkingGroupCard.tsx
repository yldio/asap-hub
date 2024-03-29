import { WorkingGroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Caption, StateTag } from '../atoms';
import { successIcon } from '../icons';
import { formatDate } from '../date';
import EntityCard from './EntityCard';

type WorkingGroupCardProps = Pick<
  WorkingGroupResponse,
  | 'id'
  | 'title'
  | 'shortText'
  | 'externalLink'
  | 'lastModifiedDate'
  | 'complete'
  | 'tags'
>;

const WorkingGroupCard: React.FC<WorkingGroupCardProps> = ({
  id,
  title,
  shortText,
  externalLink,
  lastModifiedDate,
  complete,
  tags,
}) => {
  const href = network({})
    .workingGroups({})
    .workingGroup({ workingGroupId: id }).$;

  const footer = (
    <Caption noMargin>{`Last updated: ${formatDate(
      new Date(lastModifiedDate),
    )}`}</Caption>
  );
  return (
    <EntityCard
      active={!complete}
      footer={footer}
      googleDrive={externalLink}
      href={href}
      inactiveBadge={
        <StateTag accent="green" icon={successIcon} label="Complete" />
      }
      tags={tags}
      text={shortText}
      title={title}
    />
  );
};

export default WorkingGroupCard;
