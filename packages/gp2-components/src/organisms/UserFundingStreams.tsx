import { gp2 } from '@asap-hub/model';
import { UserProfilePlaceholderCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { EditableCard, ExpandableText } from '../molecules';

type UserFundingStreamsProps = Pick<gp2.UserResponse, 'fundingStreams'> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserFundingStreams: React.FC<UserFundingStreamsProps> = ({
  fundingStreams,
  editHref,
}) => (
  <EditableCard
    editHref={editHref}
    title="Funding Providers"
    edit={!!fundingStreams}
    optional
  >
    {editHref && !fundingStreams ? (
      <UserProfilePlaceholderCard>
        List out the funding providers that you recieve in order to carry out
        your work.
      </UserProfilePlaceholderCard>
    ) : (
      <ExpandableText>{fundingStreams}</ExpandableText>
    )}
  </EditableCard>
);

export default UserFundingStreams;
