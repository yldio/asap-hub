import { gp2 } from '@asap-hub/model';
import {
  LabeledDropdown,
  LabeledMultiSelect,
  LabeledTextField,
  LabeledTypeahead,
  mail,
} from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import EditUserModal from './EditUserModal';

const { createMailTo } = mail;

const getValues = <T extends string>(selected: T[]) =>
  selected.map((item) => ({ label: item, value: item }));

const onChange =
  <T extends string>(setValue: (items: T[]) => void) =>
  (newValues: Readonly<{ value: T; label: T }[]>) => {
    setValue(newValues.map(({ value }) => value));
  };

const required = '(required)';
const optional = '(optional)';

type KeyInformationModalProps = Pick<
  gp2.UserResponse,
  | 'firstName'
  | 'lastName'
  | 'degrees'
  | 'role'
  | 'region'
  | 'country'
  | 'city'
  | 'positions'
> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    loadInstitutionOptions: (newValue?: string) => Promise<string[]>;
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
    locationSuggestions: string[];
  };

const KeyInformationModal: React.FC<KeyInformationModalProps> = ({
  onSave,
  backHref,
  firstName,
  lastName,
  degrees,
  role,
  region,
  locationSuggestions,
  country,
  city,
  positions,
  loadInstitutionOptions,
}) => {
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [newDegrees, setNewDegrees] = useState(degrees || []);
  const [newRole, setNewRole] = useState(role);
  const [newRegion, setNewRegion] = useState(region);
  const [newCountry, setNewCountry] = useState(country);
  const [newCity, setNewCity] = useState(city || '');
  const [primaryPosition, ...otherPositions] = positions || [];
  const [newPrimaryInstitution, setNewPrimaryInstitution] = useState(
    primaryPosition?.institution || '',
  );
  const [newPrimaryRole, setNewPrimaryRole] = useState(
    primaryPosition?.role || '',
  );
  const [newPrimaryDepartment, setNewPrimaryDepartment] = useState(
    primaryPosition?.department || '',
  );

  const checkDirty = () =>
    newFirstName !== firstName ||
    newLastName !== lastName ||
    newDegrees !== degrees ||
    newRole !== role ||
    newRegion !== region ||
    newCountry !== country ||
    newCity !== city ||
    newPrimaryDepartment !== primaryPosition.department ||
    newPrimaryRole !== primaryPosition.role ||
    newPrimaryInstitution !== primaryPosition.institution;

  return (
    <EditUserModal
      title="Key Information"
      description="Tell us a little more about yourself. This will help others to be able to connect with you or credit you in the right way."
      onSave={() =>
        onSave({
          firstName: newFirstName,
          lastName: newLastName,
          degrees: newDegrees,
          region: newRegion,
          country: newCountry,
          city: newCity,
          positions: [
            {
              role: newPrimaryRole,
              department: newPrimaryDepartment,
              institution: newPrimaryInstitution,
            },
            ...otherPositions,
          ],
        })
      }
      backHref={backHref}
      dirty={checkDirty()}
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
          />
          <LabeledTextField
            title="Last Name"
            subtitle={required}
            required
            enabled={!isSaving}
            value={newLastName}
            onChange={setNewLastName}
          />
          <LabeledMultiSelect
            title="Degree"
            subtitle={optional}
            enabled={!isSaving}
            values={getValues(newDegrees)}
            onChange={onChange(setNewDegrees)}
            suggestions={getValues([...gp2.userDegrees])}
            placeholder="Start typing to choose your highest clinical and/or academic degrees"
          />
          <LabeledDropdown
            title="GP2 Role"
            description={
              <span>
                Need to change something? Contact{' '}
                <a
                  href={createMailTo('techsupport@gp2.org', {
                    subject: 'GP2 Hub: Tech support',
                  })}
                >
                  techsupport@gp2.org
                </a>
              </span>
            }
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
            title="City"
            subtitle={optional}
            enabled={!isSaving}
            value={newCity}
            onChange={setNewCity}
          />
          <LabeledTypeahead
            title="Primary Institution"
            subtitle={required}
            required
            getValidationMessage={() => 'Please add your institution'}
            maxLength={44}
            onChange={setNewPrimaryInstitution}
            value={newPrimaryInstitution}
            enabled={!isSaving}
            loadOptions={loadInstitutionOptions}
          />
          <LabeledTextField
            title="Primary Department"
            subtitle={required}
            enabled={!isSaving}
            value={newPrimaryDepartment}
            onChange={setNewPrimaryDepartment}
            required
          />
          <LabeledTextField
            title="Primary Role"
            subtitle={required}
            enabled={!isSaving}
            value={newPrimaryRole}
            onChange={setNewPrimaryRole}
            required
          />
        </>
      )}
    </EditUserModal>
  );
};

export default KeyInformationModal;
