import { Route, Routes, useNavigate } from 'react-router-dom';
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

export type RorInstitutionName = {
  readonly value: string;
  readonly types?: ReadonlyArray<string>;
  readonly lang: string | null;
};

export type RorInstitution = {
  readonly names?: ReadonlyArray<RorInstitutionName>;
};

export type RorApiResponse = {
  readonly items?: ReadonlyArray<RorInstitution>;
};

export const extractInstitutionDisplayName = (
  institution: RorInstitution,
): string | null => {
  const { names } = institution;
  if (!names || names.length === 0) {
    return null;
  }

  const displayName = names.find((name) => name.types?.includes('ror_display'));
  const fallbackName = names[0];

  return displayName?.value || fallbackName?.value || null;
};

export const transformRorInstitutionsToNames = (
  response: RorApiResponse,
): string[] => {
  const items = response?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items
    .map(extractInstitutionDisplayName)
    .filter((name): name is string => name !== null);
};

export const loadInstitutionOptions = async (
  searchQuery?: string,
): Promise<string[]> => {
  try {
    const response = await getInstitutions({ searchQuery });
    return transformRorInstitutionsToNames(response as RorApiResponse);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load institutions:', error);
    return [];
  }
};

const Editing: React.FC<EditingProps> = ({ user, backHref }) => {
  const navigate = useNavigate();
  const route = network({}).users({}).user({ userId: user.id }).about({});

  const patchUser = usePatchUserById(user.id);

  return (
    <Routes>
      <Route
        path={route.editPersonalInfo.template}
        element={
          <Frame title="Edit Personal Information">
            <PersonalInfoModal
              {...user}
              countrySuggestions={countrySuggestions.map(
                ({ countryName }) => countryName,
              )}
              loadInstitutionOptions={loadInstitutionOptions}
              backHref={backHref}
              onSave={patchUser}
            />
          </Frame>
        }
      />
      <Route
        path={route.editContactInfo.template}
        element={
          <Frame title="Edit Contact Information">
            <ContactInfoModal
              {...user}
              email={user.contactEmail}
              fallbackEmail={user.email}
              backHref={backHref}
              onSave={patchUser}
            />
          </Frame>
        }
      />
      <Route
        path={route.editOnboarded.template}
        element={
          <Frame title="Publish your profile">
            <ConfirmModal
              backHref={backHref}
              successHref="/"
              title="Ready to publish your profile?"
              description="In order to show you the Hub, we will need to make your profile public to the Hub network. Would you like to continue?"
              error="There was an error and we were unable to publish your profile"
              cancelText="Cancel"
              confirmText="Publish Profile"
              onSave={async () => {
                await patchUser({ onboarded: true });
                navigate(backHref);
              }}
            />
          </Frame>
        }
      />
    </Routes>
  );
};

export default Editing;
