import React, { useState, ComponentProps, useRef, useEffect } from 'react';

import { AdminInviteUserPage } from '@asap-hub/react-components';

import { API_BASE_URL } from '../config';

const Admin = () => {
  const [invitationState, setInvitationState] = useState<
    ComponentProps<typeof AdminInviteUserPage>['state']
  >('initial');

  const requestController = useRef<AbortController>();
  useEffect(() => () => requestController.current?.abort(), []);

  const inviteUser: ComponentProps<
    typeof AdminInviteUserPage
  >['onInviteUser'] = (invitee, adminPassword) => {
    setInvitationState('loading');
    const { signal } = (requestController.current = new AbortController());

    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminPassword}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(invitee),
      signal,
    })
      .then((resp) => {
        if (resp.ok) setInvitationState('success');
        else setInvitationState(new Error(resp.statusText));
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setInvitationState(error);
      });
  };

  return (
    <AdminInviteUserPage state={invitationState} onInviteUser={inviteUser} />
  );
};

export default Admin;
