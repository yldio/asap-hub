import { gp2 } from '@asap-hub/model';
import { UserProfilePlaceholderCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { ExpandableText } from '../molecules';
import EditableCard from '../molecules/EditableCard';

type UserBiographyProps = Pick<gp2.UserResponse, 'biography'> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserBiography: React.FC<UserBiographyProps> = ({
  biography,
  editHref,
}) => (
  <EditableCard editHref={editHref} title="Biography" edit={!!biography}>
    {biography ? (
      <ExpandableText>{biography}</ExpandableText>
    ) : (
      <UserProfilePlaceholderCard>
        Summarize your background and highlight any past achievements to give
        members of the platform a better understanding of who you are.
      </UserProfilePlaceholderCard>
    )}
  </EditableCard>
);

export default UserBiography;
