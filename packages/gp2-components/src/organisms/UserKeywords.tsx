import { gp2 } from '@asap-hub/model';
import {
  TagList,
  UserProfilePlaceholderCard,
} from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import EditableCard from '../molecules/EditableCard';

type UserKeywordsProps = Pick<gp2.UserResponse, 'tags'> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserKeywords: React.FC<UserKeywordsProps> = ({ tags, editHref }) => (
  <EditableCard
    editHref={editHref}
    title="Keywords"
    edit={!!tags && tags.length > 0}
  >
    {editHref && !(tags?.length > 0) ? (
      <UserProfilePlaceholderCard>
        Help others to know more about the work that you do by selecting up to
        ten keywords.
      </UserProfilePlaceholderCard>
    ) : (
      <TagList tags={tags.map((k) => k.name)} />
    )}
  </EditableCard>
);

export default UserKeywords;
