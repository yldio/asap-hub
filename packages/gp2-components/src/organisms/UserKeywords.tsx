import { gp2 } from '@asap-hub/model';
import {
  TagList,
  UserProfilePlaceholderCard,
} from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import EditableCard from '../molecules/EditableCard';

type UserKeywordsProps = Pick<gp2.UserResponse, 'keywords'> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserKeywords: React.FC<UserKeywordsProps> = ({ keywords, editHref }) => (
  <EditableCard
    editHref={editHref}
    title="Keywords"
    edit={!!keywords && keywords.length > 0}
  >
    {keywords && keywords.length > 0 ? (
      <TagList tags={keywords} />
    ) : (
      <UserProfilePlaceholderCard>
        Help others to know more about the work that you do by selecting up to
        ten keywords.
      </UserProfilePlaceholderCard>
    )}
  </EditableCard>
);

export default UserKeywords;
