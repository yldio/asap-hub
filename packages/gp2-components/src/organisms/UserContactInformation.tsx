import { gp2 } from '@asap-hub/model';
import { pixels, UserProfilePlaceholderCard } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import EditableCard from '../molecules/EditableCard';
import EmailSection from './EmailSection';

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(24),
});

type UserContactInformationProps = Pick<
  gp2.UserResponse,
  'email' | 'alternativeEmail'
> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserContactInformation: React.FC<UserContactInformationProps> = ({
  email,
  alternativeEmail,
  editHref,
}) => (
  <EditableCard
    editHref={editHref}
    title="Contact Details"
    optional
    edit={!!alternativeEmail}
  >
    <div css={containerStyles}>
      <EmailSection
        contactEmails={[{ email, contact: 'Institutional email' }]}
      />
      {editHref && !alternativeEmail ? (
        <UserProfilePlaceholderCard>
          Provide alternative contact details.
        </UserProfilePlaceholderCard>
      ) : (
        <EmailSection
          contactEmails={[
            { email: alternativeEmail, contact: 'Alternative email' },
          ]}
        />
      )}
    </div>
  </EditableCard>
);

export default UserContactInformation;
