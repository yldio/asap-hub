import React, { useRef, useState } from 'react';

import { Button } from '../atoms';
import { noop } from '../utils';
import { LabeledTextField, LabeledPasswordField } from '../molecules';

interface InviteUserFormProps {
  readonly onSubmit?: (
    invitee: { displayName: string; email: string },
    adminPassword: string,
  ) => void;
}
const InviteUserForm: React.FC<InviteUserFormProps> = ({ onSubmit = noop }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (form.current!.reportValidity()) {
      onSubmit({ displayName, email }, adminPassword);
    }
  };
  return (
    <form
      ref={form}
      css={{
        width: 'max-content',
        maxWidth: '100%',
      }}
    >
      <LabeledTextField
        title="Invitee Full Name"
        placeholder="John Doe"
        required
        value={displayName}
        onChange={setDisplayName}
      />
      <LabeledTextField
        type="email"
        title="Invitee E-Mail Address"
        placeholder="john.doe@example.com"
        required
        value={email}
        onChange={setEmail}
      />
      <LabeledPasswordField
        forgotPasswordHref="mailto:philanthropy@milkeninstitute.org"
        title="Administrator Password"
        placeholder="_%6.o*fGR75)':7,"
        value={adminPassword}
        onChange={setAdminPassword}
      />
      <Button primary onClick={handleSubmit}>
        Invite
      </Button>
    </form>
  );
};

export default InviteUserForm;
