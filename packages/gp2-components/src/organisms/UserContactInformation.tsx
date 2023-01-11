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
    title="Contact Information"
    optional
    edit={!!secondaryEmail}
  >
    {secondaryEmail ? (
      <EmailSection
        contactEmails={[
          { email, contact: 'Institutional Email' },
          { email: secondaryEmail, contact: 'Alternative Email' },
        ]}
      />
    ) : (
      <UserProfilePlaceholderCard>
        Provide alternative contact details to your institutional email used to
        sign up.
      </UserProfilePlaceholderCard>
    )}
  </EditableCard>
);

export default UserContactInformation;
