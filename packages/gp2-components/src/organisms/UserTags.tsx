import { gp2 } from '@asap-hub/model';
import { tags as tagRoute } from '@asap-hub/routing';
import {
  TagList,
  UserProfilePlaceholderCard,
} from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import EditableCard from '../molecules/EditableCard';

type UserTagsProps = Pick<gp2.UserResponse, 'tags'> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserTags: React.FC<UserTagsProps> = ({ tags, editHref }) => (
  <EditableCard
    editHref={editHref}
    title="Tags"
    edit={!!tags && tags.length > 0}
    subtitle="Explore keywords related to skills, techniques, resources, and tools."
  >
    {editHref && !(tags?.length > 0) ? (
      <UserProfilePlaceholderCard>
        Help others to know more about the work that you do by selecting up to
        ten keywords.
      </UserProfilePlaceholderCard>
    ) : (
      <TagList
        tags={tags.map((k) => ({
          tag: k.name,
          href: tagRoute({ tag: k.name }).$,
        }))}
      />
    )}
  </EditableCard>
);

export default UserTags;
