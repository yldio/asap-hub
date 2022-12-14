import { gp2 } from '@asap-hub/model';
import {
  Button,
  LabeledDropdown,
  LabeledMultiSelect,
  LabeledTextField,
  LabeledTypeahead,
  mail,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import EditUserModal from './EditUserModal';

const { createMailTo } = mail;

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
    (newPositions.length > 0 &&
      newPositions[0].department !== positions[0]?.department &&
      newPositions[0].role !== positions[0]?.role &&
      newPositions[0].institution !== positions[0]?.institution);

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
            subtitle={optional}
            enabled={!isSaving}
            values={getValues(newDegrees)}
            onChange={onChangeSelect(setNewDegrees)}
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
          <UserPositions
            setPositions={setPositions}
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

const buttonStyles = css({
  width: '100%',
  // [mobileQuery]: {
  //   width: '100%',
  // },
});

type UserPositionsProps = {
  setPositions: (value: React.SetStateAction<gp2.UserPosition[]>) => void;
  isSaving: boolean;
  loadInstitutionOptions: (newValue?: string) => Promise<string[]>;
  positions: gp2.UserResponse['positions'];
};
const UserPositions: React.FC<UserPositionsProps> = ({
  setPositions,
  isSaving,
  loadInstitutionOptions,
  positions,
}) => {
  const updatePositions: ComponentProps<
    typeof UserPosition
  >['updatePositions'] = (position, index) => {
    setPositions((previousState) =>
      Object.assign([], previousState, { [index]: position }),
    );
  };

  const addPosition = () => {
    setPositions((previousState) => [
      ...previousState,
      { institution: '', department: '', role: '' },
    ]);
  };
  return (
    <>
      {positions.map((position, index) => (
        <UserPosition
          updatePositions={updatePositions}
          isSaving={isSaving}
          loadInstitutionOptions={loadInstitutionOptions}
          position={position}
          index={index}
          key={`position-${index}`}
        />
      ))}
      <div css={buttonStyles}>
        <Button onClick={addPosition} enabled={!isSaving} noMargin>
          Add Another Institution
        </Button>
      </div>
    </>
  );
};

type UserPositionProps = {
  index: number;
  updatePositions: (
    payload: gp2.UserResponse['positions'][number],
    index: number,
  ) => void;
  isSaving: boolean;
  loadInstitutionOptions: (newValue?: string) => Promise<string[]>;
  position: gp2.UserPosition;
};
const UserPosition: React.FC<UserPositionProps> = ({
  updatePositions,
  isSaving,
  loadInstitutionOptions,
  position,
  index,
}) => {
  const { institution = '', department = '', role = '' } = position;
  const onChange = (property: keyof gp2.UserPosition) => (value: string) =>
    updatePositions({ ...position, [property]: value }, 0);

  const prefix = index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Other';
  return (
    <>
      <LabeledTypeahead
        title={`${prefix} Institution`}
        subtitle={required}
        required
        getValidationMessage={() => 'Please add your institution'}
        maxLength={44}
        onChange={onChange('institution')}
        value={institution}
        enabled={!isSaving}
        loadOptions={loadInstitutionOptions}
      />
      <LabeledTextField
        title={`${prefix} Department`}
        subtitle={required}
        enabled={!isSaving}
        onChange={onChange('department')}
        value={department}
        required
      />
      <LabeledTextField
        title={`${prefix} Role`}
        subtitle={required}
        enabled={!isSaving}
        onChange={onChange('role')}
        value={role}
        required
      />
    </>
  );
};
