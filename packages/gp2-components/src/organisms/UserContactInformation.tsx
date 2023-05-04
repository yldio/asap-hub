import { gp2 } from '@asap-hub/model';
import { UserProfilePlaceholderCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import EditableCard from '../molecules/EditableCard';
import EmailSection from './EmailSection';

type UserContactInformationProps = Pick<
  gp2.UserResponse,
  'email' | 'secondaryEmail'
> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserContactInformation: React.FC<UserContactInformationProps> = ({
  email,
  secondaryEmail,
  editHref,
}) => (
  <EditableCard
    editHref={editHref}
    title="Contact Details"
    optional
    edit={!!secondaryEmail}
  >
    {editHref && !secondaryEmail ? (
      <UserProfilePlaceholderCard>
        Provide alternative contact details.
      </UserProfilePlaceholderCard>
    ) : (
      <EmailSection
        contactEmails={[
          { email, contact: 'Institutional email' },
          { email: secondaryEmail, contact: 'Alternative email' },
        ]}
      />
    )}
  </EditableCard>
);

export default UserContactInformation;
