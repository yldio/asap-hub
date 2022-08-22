import { Route, useRouteMatch } from 'react-router-dom';
import {
  PersonalInfoModal,
  ContactInfoModal,
  ConfirmModal,
} from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { usePatchUserById } from './state';
import countrySuggestions from './country-suggestions';
import { getInstitutions } from './api';

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
          <PersonalInfoModal
            {...user}
            countrySuggestions={countrySuggestions.map(
              ({ countryName }) => countryName,
            )}
            loadInstitutionOptions={(searchQuery) =>
              getInstitutions({ searchQuery }).then((data) =>
                data.items.map(({ name }) => name),
              )
            }
            backHref={backHref}
            onSave={patchUser}
          />
        </Frame>
      </Route>
      <Route exact path={path + route.editContactInfo.template}>
        <Frame title="Edit Contact Information">
          <ContactInfoModal
            {...user}
            email={user.contactEmail}
            fallbackEmail={user.email}
            backHref={backHref}
            onSave={patchUser}
          />
        </Frame>
      </Route>
      <Route exact path={path + route.editOnboarded.template}>
        <Frame title="Publish your profile">
          <ConfirmModal
            backHref={backHref}
            successHref="/"
            title="Ready to publish your profile?"
            description="In order to show you the Hub, we will need to make your profile public to the Hub network. Would you like to continue?"
            error="There was an error and we were unable to publish your profile"
            cancelText="Back to Editing"
            confirmText="Publish and Explore"
            onSave={() => patchUser({ onboarded: true })}
          />
        </Frame>
      </Route>
    </>
  );
};

export default Editing;
