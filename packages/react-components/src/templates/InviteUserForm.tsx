import React, { useRef } from 'react';

import { Paragraph, Button } from '../atoms';
import { useInput } from '../hooks';
import { noop } from '../utils';

interface InviteUserFormProps {
  onSubmit?: (
    invitee: { displayName: string; email: string },
    adminPassword: string,
  ) => void;
}
const InviteUserForm: React.FC<InviteUserFormProps> = ({ onSubmit = noop }) => {
  const [displayNameInputProps, displayName] = useInput<string>('');
  const [emailInputProps, email] = useInput<string>('');
  const [adminPasswordInputProps, adminPassword] = useInput<string>('');

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

        '& label': {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          whiteSpace: 'pre',
        },
      }}
    >
      <Paragraph>
        <label>
          Invitee Full Name:{' '}
          <input
            {...displayNameInputProps}
            type="text"
            name="displayName"
            placeholder="John Doe"
            required
          />
        </label>
      </Paragraph>
      <Paragraph>
        <label>
          Invitee E-Mail Address:{' '}
          <input
            {...emailInputProps}
            type="email"
            name="email"
            placeholder="john.doe@example.com"
            required
          />
        </label>
      </Paragraph>
      <Paragraph>
        <label>
          Administrator Password:{' '}
          <input
            {...adminPasswordInputProps}
            type="password"
            name="adminPassword"
            placeholder="_%6.o*fGR75)':7,"
            required
          />
        </label>
      </Paragraph>
      <Button onClick={handleSubmit} primary>
        Invite
      </Button>
    </form>
  );
};

export default InviteUserForm;
