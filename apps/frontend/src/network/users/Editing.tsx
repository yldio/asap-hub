import React from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
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
  const history = useHistory();
  const { path, url } = useRouteMatch();

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <Route exact path={`${path}/${EDIT_PERSONAL_INFO_PATH}`}>
        <PersonalInfoModal
          {...user}
          backHref={url}
          onSave={async (patch) => {
            await patchUser(patch);
            history.push(url);
          }}
        />
      </Route>
      <Route exact path={`${path}/${EDIT_CONTACT_INFO_PATH}`}>
        <ContactInfoModal
          email={user.contactEmail}
          fallbackEmail={user.email}
          backHref={url}
          onSave={async (newContactEmail) => {
            await patchUser({
              contactEmail: newContactEmail,
            });
            history.push(url);
          }}
        />
      </Route>
    </>
  );
};

export default Editing;
