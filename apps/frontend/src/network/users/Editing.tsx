import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import {
  PersonalInfoModal,
  ContactInfoModal,
} from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { usePatchUserById } from './state';

interface EditingProps {
  user: UserResponse;
}
const Editing: React.FC<EditingProps> = ({ user }) => {
  const { path } = useRouteMatch();
  const route = network({}).users({}).user({ userId: user.id }).about({});

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <Route exact path={path + route.editPersonalInfo.template}>
        <PersonalInfoModal {...user} backHref={route.$} onSave={patchUser} />
      </Route>
      <Route exact path={path + route.editContactInfo.template}>
        <ContactInfoModal
          email={user.contactEmail}
          fallbackEmail={user.email}
          backHref={route.$}
          onSave={(newContactEmail) =>
            patchUser({
              contactEmail: newContactEmail,
            })
          }
        />
      </Route>
    </>
  );
};

export default Editing;
