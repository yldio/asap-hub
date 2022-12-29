import { gp2 } from '@asap-hub/model';
import {
  LabeledDropdown,
  LabeledMultiSelect,
  LabeledTextField,
} from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import { ContactSupport, UserPositions } from '../molecules';
import EditUserModal from './EditUserModal';

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
  | 'lastName'
  | 'degrees'
  | 'role'
  | 'region'
  | 'country'
  | 'city'
  | 'positions'
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
  const [newCity, setNewCity] = useState(city);

  const [newPositions, setPositions] = useState(
    positions.length
      ? positions
      : [{ institution: '', role: '', department: '' }],
  );

  const checkDirty = () =>
    newFirstName !== firstName ||
    newLastName !== lastName ||
    newDegrees !== degrees ||
    newRole !== role ||
    newRegion !== region ||
    newCountry !== country ||
    newCity !== city ||
    newPositions.some(
      (newPosition, index) =>
        newPosition.department !== positions[index]?.department ||
        newPosition.role !== positions[index]?.role ||
        newPosition.institution !== positions[index]?.institution,
    );
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
          positions: newPositions,
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
            subtitle={required}
            enabled={!isSaving}
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
            title="City"
            subtitle={optional}
            enabled={!isSaving}
            value={newCity || ''}
            onChange={setNewCity}
          />
          <UserPositions
            onChange={setPositions}
            isSaving={isSaving}
            loadInstitutionOptions={loadInstitutionOptions}
            positions={newPositions}
          />
        </>
      )}
    </EditUserModal>
  );
};

export default KeyInformationModal;
