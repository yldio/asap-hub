import React, { useState, ComponentProps, useRef, useEffect } from 'react';

import { AdminInviteUserPage } from '@asap-hub/react-components';

import { API_BASE_URL } from '../config';

const Admin: React.FC<{}> = () => {
  const [invitationState, setInvitationState] = useState<
    ComponentProps<typeof AdminInviteUserPage>['state']
  >('initial');

  const requestController = useRef<AbortController>();
  useEffect(() => () => requestController.current?.abort(), []);

  const inviteUser: ComponentProps<
    typeof AdminInviteUserPage
  >['onInviteUser'] = async (invitee, adminPassword) => {
    setInvitationState('loading');
    const { signal } = (requestController.current = new AbortController());

    try {
      const resp = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${adminPassword}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(invitee),
        signal,
      });

      if (resp.ok) {
        setInvitationState('success');
      } else {
        setInvitationState(new Error(`${resp.status} ${resp.statusText}`));
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setInvitationState(err);
    }
  };

  return (
    <AdminInviteUserPage state={invitationState} onInviteUser={inviteUser} />
  );
};

export default Admin;
