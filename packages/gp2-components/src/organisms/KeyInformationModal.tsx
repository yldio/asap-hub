import { gp2 } from '@asap-hub/model';
import {
  LabeledDropdown,
  LabeledMultiSelect,
  LabeledTextField,
} from '@asap-hub/react-components';
import { ComponentProps, useMemo, useState } from 'react';
import { ContactSupport, UserPositions } from '../molecules';
import EditUserModal from './EditUserModal';
import UserExternalProfilesForm, { baseUrls } from './UserExternalProfilesForm';

const getValues = <T extends string>(selected: T[]) =>
  selected.map((item) => ({ label: item, value: item }));

const onChangeSelect =
  <T extends string>(setValue: (items: T[]) => void) =>
  (newValues: Readonly<{ value: T; label: T }[]>) => {
    setValue(newValues.map(({ value }) => value));
  };

const required = '(required)';
const optional = '(optional)';

type KeyInformationModalProps = Pick<
  gp2.UserResponse,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'nickname'
  | 'degrees'
  | 'role'
  | 'region'
  | 'country'
  | 'stateOrProvince'
  | 'city'
  | 'positions'
  | 'social'
> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    loadInstitutionOptions: ComponentProps<
      typeof UserPositions
    >['loadInstitutionOptions'];
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
    locationSuggestions: string[];
  };

const KeyInformationModal: React.FC<KeyInformationModalProps> = ({
  onSave,
  backHref,
  firstName,
  middleName = '',
  lastName,
  nickname = '',
  degrees,
  role,
  region,
  locationSuggestions,
  country,
  stateOrProvince,
  city,
  positions,
  loadInstitutionOptions,
  social,
}) => {
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newMiddleName, setNewMiddleName] = useState(middleName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [newNickname, setNewNickname] = useState(nickname);
  const [newDegrees, setNewDegrees] = useState(degrees || []);
  const [newRole, setNewRole] = useState(role);
  const [newRegion, setNewRegion] = useState(region);
  const [newCountry, setNewCountry] = useState(country);
  const [newStateOrProvince, setNewStateOrProvince] =
    useState<string>(stateOrProvince);
  const [newCity, setNewCity] = useState(city);

  const [newPositions, setPositions] = useState(
    positions.length
      ? positions
      : [{ institution: '', role: '', department: '' }],
  );

  const initialSocial: gp2.UserSocial = useMemo(
    () => ({
      ...social,
      orcid: social?.orcid?.split(baseUrls.orcid)[1] || '',
      researcherId: social?.researcherId?.split(baseUrls.researcherId)[1] || '',
    }),
    [social],
  );
  const [newSocial, setNewSocial] = useState(initialSocial);

  const isDirty =
    newFirstName !== firstName ||
    newMiddleName !== middleName ||
    newLastName !== lastName ||
    newNickname !== nickname ||
    newDegrees.some((newDegree, index) => newDegree !== degrees[index]) ||
    newRole !== role ||
    newRegion !== region ||
    newCountry !== country ||
    newStateOrProvince !== stateOrProvince ||
    newCity !== city ||
    newPositions.some(
      (newPosition, index) =>
        newPosition.department !== positions[index]?.department ||
        newPosition.role !== positions[index]?.role ||
        newPosition.institution !== positions[index]?.institution,
    ) ||
    newSocial?.googleScholar !== social?.googleScholar ||
    newSocial?.orcid !== social?.orcid?.split(baseUrls.orcid)[1] ||
    newSocial?.researchGate !== social?.researchGate ||
    newSocial?.researcherId !==
      social?.researcherId?.split(baseUrls.researcherId)[1] ||
    newSocial?.blog !== social?.blog ||
    newSocial?.blueSky !== social?.blueSky ||
    newSocial?.threads !== social?.threads ||
    newSocial?.twitter !== social?.twitter ||
    newSocial?.linkedIn !== social?.linkedIn ||
    newSocial?.github !== social?.github;

  return (
    <EditUserModal
      stickyTitle={false}
      title="Key Information"
      description="Tell us a little more about yourself. This will help others to be able to connect with you or credit you in the right way."
      onSave={() => {
        const { orcid: newOrcid, ...newSocialRest } =
          newSocial as gp2.UserSocial;

        return onSave({
          firstName: newFirstName,
          middleName: newMiddleName,
          lastName: newLastName,
          nickname: newNickname,
          degrees: newDegrees,
          region: newRegion,
          country: newCountry,
          stateOrProvince: newStateOrProvince,
          city: newCity,
          positions: newPositions,
          social: Object.entries(newSocialRest).reduce(
            (payload, [key, value]) => {
              if (key === 'researcherId') {
                return {
                  ...payload,
                  researcherId: value
                    ? `${baseUrls.researcherId}${value}`
                    : undefined,
                };
              }
              return {
                ...payload,
                [key]: value.trim().length ? value : undefined,
              };
            },
            {},
          ),
          ...(newOrcid ? { orcid: newOrcid } : {}),
        });
      }}
      backHref={backHref}
      dirty={isDirty}
    >
      {({ isSaving }) => (
        <>
          <LabeledTextField
            title="First Name"
            subtitle={required}
            required
            enabled={!isSaving}
            value={newFirstName}
            onChange={setNewFirstName}
            maxLength={50}
          />
          <LabeledTextField
            title="Middle Name(s)"
            subtitle={optional}
            enabled={!isSaving}
            value={newMiddleName}
            onChange={setNewMiddleName}
            maxLength={50}
            hint="It will be shown as initials."
          />
          <LabeledTextField
            title="Last Name"
            subtitle={required}
            required
            enabled={!isSaving}
            value={newLastName}
            onChange={setNewLastName}
            maxLength={50}
          />
          <LabeledTextField
            title="Nickname"
            subtitle={optional}
            enabled={!isSaving}
            value={newNickname}
            onChange={setNewNickname}
            maxLength={50}
            hint="It will be displayed in parentheses after your first name."
          />
          <LabeledMultiSelect
            title="Degree"
            subtitle={required}
            enabled={!isSaving}
            required
            values={getValues(newDegrees)}
            onChange={onChangeSelect(setNewDegrees)}
            suggestions={getValues([...gp2.userDegrees])}
            placeholder="Start typing to choose your highest clinical and/or academic degrees"
          />
          <LabeledDropdown
            title="GP2 Role"
            description={<ContactSupport />}
            options={getValues([...gp2.userRoles])}
            value={newRole}
            required
            onChange={setNewRole}
            enabled={false}
          />
          <LabeledDropdown
            title="Region"
            subtitle={required}
            description="Select the region you are based in."
            options={getValues([...gp2.userRegions])}
            value={newRegion}
            required
            onChange={setNewRegion}
            enabled={!isSaving}
            placeholder={'Start typing to choose your region'}
          />
          <LabeledDropdown
            title="Location"
            subtitle={required}
            description="Select the location you are based in."
            options={getValues(locationSuggestions)}
            value={newCountry}
            required
            onChange={setNewCountry}
            enabled={!isSaving}
            placeholder={'Start typing to choose your location'}
          />
          <LabeledTextField
            title="State/Province"
            subtitle={required}
            customValidationMessage={
              newStateOrProvince?.trim() === ''
                ? 'Please add your state/province'
                : ''
            }
            enabled={!isSaving}
            value={newStateOrProvince || ''}
            onChange={setNewStateOrProvince}
          />
          <LabeledTextField
            title="City"
            subtitle={required}
            enabled={!isSaving}
            value={newCity || ''}
            required
            getValidationMessage={() => 'Please add your city'}
            onChange={setNewCity}
          />
          <UserPositions
            onChange={setPositions}
            isSaving={isSaving}
            loadInstitutionOptions={loadInstitutionOptions}
            positions={newPositions}
          />
          <UserExternalProfilesForm
            onChange={setNewSocial}
            newSocial={newSocial}
            social={social}
            isSaving={isSaving}
          />
        </>
      )}
    </EditUserModal>
  );
};

export default KeyInformationModal;
