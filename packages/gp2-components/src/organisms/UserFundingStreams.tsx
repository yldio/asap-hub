import { gp2 } from '@asap-hub/model';
import {
  UserProfilePlaceholderCard,
  ExpandableText,
} from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { EditableCard } from '../molecules';

type UserFundingStreamsProps = Pick<gp2.UserResponse, 'fundingStreams'> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserFundingStreams: React.FC<UserFundingStreamsProps> = ({
  fundingStreams,
  editHref,
}) => (
  <EditableCard
    editHref={editHref}
    title="Financial Disclosures"
    subtitle="This member has funding from the following sources:"
    edit={!!fundingStreams}
    optional
  >
    {editHref && !fundingStreams ? (
      <UserProfilePlaceholderCard>
        Please list any funding sources you would need to disclose in a
        resulting GP2 publication where you are listed as an author.
      </UserProfilePlaceholderCard>
    ) : (
      <ExpandableText>{fundingStreams}</ExpandableText>
    )}
  </EditableCard>
);

export default UserFundingStreams;
