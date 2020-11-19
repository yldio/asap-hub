import React from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import {
  PersonalInfoModal,
  ContactInfoModal,
} from '@asap-hub/react-components';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';

import { EDIT_PERSONAL_INFO_PATH, EDIT_CONTACT_INFO_PATH } from './routes';

interface EditingProps {
  userProfile: UserResponse;
  onPatchUserProfile: (patch: UserPatchRequest) => void | Promise<void>;
}
const Editing: React.FC<EditingProps> = ({
  userProfile,
  onPatchUserProfile,
}) => {
  const history = useHistory();
  const { path, url } = useRouteMatch();

  return (
    <>
      <Route exact path={`${path}/${EDIT_PERSONAL_INFO_PATH}`}>
        <PersonalInfoModal
          {...userProfile}
          backHref={url}
          onSave={async (data) => {
            await onPatchUserProfile(data);
            history.push(url);
          }}
        />
      </Route>
      <Route exact path={`${path}/${EDIT_CONTACT_INFO_PATH}`}>
        <ContactInfoModal
          email={userProfile.contactEmail}
          fallbackEmail={userProfile.email}
          backHref={url}
          onSave={async (newContactEmail) => {
            await onPatchUserProfile({
              contactEmail: newContactEmail,
            } as UserPatchRequest);
            history.push(url);
          }}
        />
      </Route>
    </>
  );
};

export default Editing;
