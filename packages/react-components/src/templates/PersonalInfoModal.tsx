import { UserDegree, UserPatchRequest, UserResponse } from '@asap-hub/model';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  EditUserAvatar,
  FormSection,
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
> &
  Pick<UserResponse, 'avatarUrl'> & {
    countrySuggestions: string[];
    loadInstitutionOptions: (newValue?: string) => Promise<string[]>;
    onSave?: (data: UserPatchRequest) => void | Promise<void>;
    onImageSelect?: (file: File) => void | Promise<void>;
    onImageRemove?: () => void | Promise<void>;
    backHref: string;
  };

type StagedAvatar =
  | { type: 'keep' }
  | { type: 'upload'; file: File; previewUrl: string }
  | { type: 'remove' };

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
  avatarUrl,

  countrySuggestions,
  loadInstitutionOptions,
  onSave = noop,
  onImageSelect,
  onImageRemove,
  backHref,
}) => {
  const navigate = useNavigate();
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
  const [stagedAvatar, setStagedAvatar] = useState<StagedAvatar>({
    type: 'keep',
  });

  const canEditAvatar = !!onImageSelect && !!onImageRemove;
  const previewAvatarUrl =
    stagedAvatar.type === 'upload'
      ? stagedAvatar.previewUrl
      : stagedAvatar.type === 'remove'
        ? undefined
        : avatarUrl;

  // revoke the object URL of the staged preview when it is replaced or unmounted
  useEffect(
    () => () => {
      if (stagedAvatar.type === 'upload') {
        URL.revokeObjectURL(stagedAvatar.previewUrl);
      }
    },
    [stagedAvatar],
  );

  const commitAvatar = async () => {
    if (stagedAvatar.type === 'upload') {
      await onImageSelect?.(stagedAvatar.file);
    } else if (stagedAvatar.type === 'remove') {
      await onImageRemove?.();
    }
  };

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
        newStateOrProvince !== stateOrProvince ||
        stagedAvatar.type !== 'keep'
      }
      backHref={backHref}
      onSave={async () => {
        await commitAvatar();
        await onSave(
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
        );
        void navigate(backHref);
      }}
    >
      {({ isSaving }) => (
        <FormSection>
          {canEditAvatar && (
            <EditUserAvatar
              avatarUrl={previewAvatarUrl}
              firstName={newFirstName}
              lastName={newLastName}
              onImageSelect={(file) =>
                setStagedAvatar({
                  type: 'upload',
                  file,
                  previewUrl: URL.createObjectURL(file),
                })
              }
              onImageRemove={() => setStagedAvatar({ type: 'remove' })}
              enabled={!isSaving}
            />
          )}
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
        </FormSection>
      )}
    </EditUserModal>
  );
};

export default PersonalInfoModal;
