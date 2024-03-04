import { UserDegree, UserPatchRequest } from '@asap-hub/model';
import { useState } from 'react';
import {
  LabeledDropdown,
  LabeledTextField,
  LabeledTypeahead,
} from '../molecules';
import { EditUserModal } from '../organisms';
import { noop } from '../utils';


type PersonalInfoModalProps = Pick<
  UserPatchRequest,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'nickname'
  | 'degree'
  | 'institution'
  | 'country'
  | 'stateOrProvince'
  | 'city'
  | 'jobTitle'
> & {
  countrySuggestions: string[];
  loadInstitutionOptions: (newValue?: string) => Promise<string[]>;
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
};

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({
  firstName = '',
  middleName = '',
  lastName = '',
  nickname = '',
  degree = '' as const,
  institution = '',
  country = '',
  stateOrProvince = '',
  city = '',
  jobTitle = '',

  countrySuggestions,
  loadInstitutionOptions,
  onSave = noop,
  backHref,
}) => {
  const [newFirstName, setNewFirstName] = useState<string>(firstName);
  const [newMiddleName, setNewMiddleName] = useState<string>(middleName);
  const [newLastName, setNewLastName] = useState<string>(lastName);
  const [newNickname, setNewNickname] = useState<string>(nickname);
  const [newDegree, setNewDegree] = useState<UserDegree | ''>(degree);
  const [newInstitution, setNewInstitution] = useState<string>(institution);
  const [newJobTitle, setNewJobTitle] = useState<string>(jobTitle);
  const [newCity, setNewCity] = useState<string>(city);
  const [newStateOrProvince, setNewStateOrProvince] =
    useState<string>(stateOrProvince);
  const [newCountry, setNewCountry] = useState<string>(country);

  return (
    <EditUserModal
      title="Main details"
      dirty={
        newFirstName !== firstName ||
        newMiddleName !== middleName ||
        newLastName !== lastName ||
        newNickname !== nickname ||
        newDegree !== degree ||
        newInstitution !== institution ||
        newJobTitle !== jobTitle ||
        newCity !== city ||
        newCountry !== country ||
        newStateOrProvince !== stateOrProvince
      }
      backHref={backHref}
      onSave={() =>
        onSave(
          Object.fromEntries(
            Object.entries({
              firstName: newFirstName,
              middleName: newMiddleName,
              lastName: newLastName,
              nickname: newNickname,
              degree: newDegree,
              institution: newInstitution,
              jobTitle: newJobTitle,
              city: newCity,
              country: newCountry,
              stateOrProvince: newStateOrProvince,
            }).map(([key, value]) => [key, value.trim()]),
          ),
        )
      }
    >
      {({ isSaving }) => (
        <div>
          <LabeledTextField
            title="First name"
            subtitle="(required)"
            onChange={setNewFirstName}
            value={newFirstName}
            enabled={!isSaving}
            required
          />
          <LabeledTextField
            title="Middle name(s)"
            subtitle="(optional)"
            onChange={setNewMiddleName}
            value={newMiddleName}
            enabled={!isSaving}
            description="It will be displayed as initials."
          />
          <LabeledTextField
            title="Last name(s)"
            subtitle="(required)"
            onChange={setNewLastName}
            value={newLastName}
            enabled={!isSaving}
            required
          />
          <LabeledTextField
            title="Nickname"
            subtitle="(optional)"
            onChange={setNewNickname}
            value={newNickname}
            enabled={!isSaving}
            description="It will be displayed in parentheses after your first name."
          />
          <LabeledDropdown<UserDegree | ''>
            title="Degree"
            subtitle="(optional)"
            onChange={setNewDegree}
            placeholder="Choose a degree"
            options={[
              { label: 'BA', value: 'BA' },
              { label: 'BSc', value: 'BSc' },
              { label: 'MSc', value: 'MSc' },
              { label: 'PhD', value: 'PhD' },
              { label: 'MD', value: 'MD' },
              { label: 'MD, PhD', value: 'MD, PhD' },
              { label: 'MPH', value: 'MPH' },
              { label: 'MA', value: 'MA' },
              { label: 'MBA', value: 'MBA' },
            ]}
            value={newDegree}
            enabled={!isSaving}
          />
          <LabeledTypeahead
            title="Institution"
            subtitle="(required)"
            required
            getValidationMessage={() => 'Please add your institution'}
            maxLength={44}
            onChange={setNewInstitution}
            value={newInstitution}
            enabled={!isSaving}
            loadOptions={loadInstitutionOptions}
          />
          <LabeledTypeahead
            title="Position"
            subtitle="(required)"
            required
            getValidationMessage={() => 'Please add your position'}
            maxLength={35}
            onChange={setNewJobTitle}
            suggestions={[
              'Assistant Professor',
              'Associate Professor',
              'Attending Physician',
              'CEO',
              'Department Chair',
              'Clinician Scientist',
              'Director/Co-Director',
              'Consultant',
              'Fellow',
              'Graduate student',
              'Postdoctoral Fellow',
              'Professor',
              'Project Manager',
              'Research Associate',
            ]}
            value={newJobTitle}
            enabled={!isSaving}
          />
          <LabeledDropdown
            title="Country"
            subtitle="(required)"
            required
            getValidationMessage={() => 'Please add your country'}
            options={countrySuggestions.map((countryName) => ({
              label: countryName,
              value: countryName,
            }))}
            onChange={setNewCountry}
            value={newCountry}
            enabled={!isSaving}
            noOptionsMessage={(value: { inputValue: string }) =>
              `No countries match "${value.inputValue}"`
            }
          />
          <LabeledTextField
            title="State/Province"
            subtitle="(required)"
            required
            getValidationMessage={() => 'Please add your state/province'}
            onChange={setNewStateOrProvince}
            value={newStateOrProvince}
            enabled={!isSaving}
          />
          <LabeledTextField
            title="City"
            subtitle="(required)"
            required
            getValidationMessage={() => 'Please add your city'}
            onChange={setNewCity}
            value={newCity}
            enabled={!isSaving}
          />
        </div>
      )}
    </EditUserModal>
  );
};

export default PersonalInfoModal;
