import { Route, useRouteMatch } from 'react-router-dom';
import {
  PersonalInfoModal,
  ContactInfoModal,
} from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { usePatchUserById } from './state';
import Frame from '../../structure/Frame';

interface EditingProps {
  user: UserResponse;
  backHref: string;
}
const Editing: React.FC<EditingProps> = ({ user, backHref }) => {
  const { path } = useRouteMatch();
  const route = network({}).users({}).user({ userId: user.id }).about({});

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <Route exact path={path + route.editPersonalInfo.template}>
        <Frame title="Edit Personal Information">
          <PersonalInfoModal {...user} backHref={backHref} onSave={patchUser} />
        </Frame>
      </Route>
      <Route exact path={path + route.editContactInfo.template}>
        <Frame title="Edit Contact Information">
          <ContactInfoModal
            email={user.contactEmail}
            fallbackEmail={user.email}
            backHref={backHref}
            onSave={patchUser}
          />
        </Frame>
      </Route>
    </>
  );
};

export default Editing;
