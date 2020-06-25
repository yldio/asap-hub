import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { Paragraph, Display } from '../atoms';
import { InviteUserForm } from '../templates';
import { Layout } from '../organisms';

const centerStyles = css({
  width: 'max-content',
  maxWidth: '100%',

  marginLeft: 'auto',
  marginRight: 'auto',

  textAlign: 'center',
});

interface AdminInviteUserPageProps {
  readonly state: 'initial' | 'loading' | 'success' | Error;
  readonly onInviteUser?: ComponentProps<typeof InviteUserForm>['onSubmit'];
}
const AdminInviteUserPage: React.FC<AdminInviteUserPageProps> = ({
  state,
  onInviteUser,
}) => {
  if (state === 'loading') {
    return <Paragraph>Inviting user...</Paragraph>;
  }

  return (
    <Layout>
      <div css={centerStyles}>
        {state === 'success' && <Paragraph>User invited.</Paragraph>}
        {state instanceof Error && (
          <Paragraph>Failed to invite user. {state.toString()}</Paragraph>
        )}
        <Display>Invite user</Display>
      </div>
      <div css={centerStyles}>
        <InviteUserForm onSubmit={onInviteUser} />
      </div>
    </Layout>
  );
};

export default AdminInviteUserPage;
