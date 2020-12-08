import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import {
  PersonalInfoModal,
  ContactInfoModal,
} from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';

import { EDIT_PERSONAL_INFO_PATH, EDIT_CONTACT_INFO_PATH } from './routes';
import { usePatchUserById } from './state';

interface EditingProps {
  user: UserResponse;
}
const Editing: React.FC<EditingProps> = ({ user }) => {
  const { path, url } = useRouteMatch();

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <Route exact path={`${path}/${EDIT_PERSONAL_INFO_PATH}`}>
        <PersonalInfoModal {...user} backHref={url} onSave={patchUser} />
      </Route>
      <Route exact path={`${path}/${EDIT_CONTACT_INFO_PATH}`}>
        <ContactInfoModal
          email={user.contactEmail}
          fallbackEmail={user.email}
          backHref={url}
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
