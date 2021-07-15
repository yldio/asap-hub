import { useState } from 'react';
import { UserPatchRequest, UserDegree } from '@asap-hub/model';
import { css } from '@emotion/react';

import {
  LabeledTextField,
  LabeledDropdown,
  LabeledTypeahead,
} from '../molecules';
import { noop } from '../utils';
import { perRem, tabletScreen } from '../pixels';
import { EditModal } from '../organisms';

const fieldsContainerStyles = css({
  display: 'grid',
  columnGap: `${24 / perRem}em`,

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr',
    rowGap: `${12 / perRem}em`,
  },
});
const paddingStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    paddingBottom: `${12 / perRem}em`,
  },
});

type PersonalInfoModalProps = Pick<
  UserPatchRequest,
  | 'firstName'
  | 'lastName'
  | 'degree'
  | 'institution'
  | 'country'
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
  lastName = '',
  degree = '' as const,
  institution = '',
  country = '',
  city = '',
  jobTitle = '',

  countrySuggestions,
  loadInstitutionOptions,
  onSave = noop,
  backHref,
}) => {
  const [newFirstName, setNewFirstName] = useState<string>(firstName);
  const [newLastName, setNewLastName] = useState<string>(lastName);
  const [newDegree, setNewDegree] = useState<UserDegree | ''>(degree);
  const [newInstitution, setNewInstitution] = useState<string>(institution);
  const [newJobTitle, setNewJobTitle] = useState<string>(jobTitle);
  const [newCity, setNewCity] = useState<string>(city);
  const [newCountry, setNewCountry] = useState<string>(country);

  return (
    <EditModal
      title="Your details"
      dirty={
        newFirstName !== firstName ||
        newLastName !== lastName ||
        newDegree !== degree ||
        newInstitution !== institution ||
        newJobTitle !== jobTitle ||
        newCity !== city ||
        newCountry !== country
      }
      backHref={backHref}
      onSave={() =>
        onSave(
          Object.fromEntries(
            Object.entries({
              firstName: newFirstName,
              lastName: newLastName,
              degree: newDegree,
              institution: newInstitution,
              jobTitle: newJobTitle,
              city: newCity,
              country: newCountry,
            }).map(([key, value]) => [key, value.trim()]),
          ),
        )
      }
    >
      {({ isSaving }) => (
        <>
          <div css={[fieldsContainerStyles, paddingStyles]}>
            <LabeledTextField
              title="First name*"
              onChange={setNewFirstName}
              value={newFirstName}
              enabled={!isSaving}
              required
            />
            <LabeledTextField
              title="Last name(s)*"
              onChange={setNewLastName}
              value={newLastName}
              enabled={!isSaving}
              required
            />
            <LabeledDropdown<UserDegree | ''>
              title="Degree"
              onChange={setNewDegree}
              options={[
                { label: 'Choose a degree', value: '' },
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
          </div>
          <div
            css={[
              fieldsContainerStyles,
              { paddingBottom: `${240 / perRem}em` },
            ]}
          >
            <LabeledTypeahead
              title="Institution*"
              required
              getValidationMessage={() => 'Please add your institution'}
              maxLength={44}
              onChange={setNewInstitution}
              value={newInstitution}
              enabled={!isSaving}
              loadOptions={loadInstitutionOptions}
            />
            <LabeledTypeahead
              title="Position*"
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
            <LabeledTypeahead
              title="Country*"
              required
              getValidationMessage={() => 'Please add your country'}
              suggestions={countrySuggestions}
              onChange={setNewCountry}
              value={newCountry}
              enabled={!isSaving}
            />
            <LabeledTextField
              title="City*"
              required
              getValidationMessage={() => 'Please add your city'}
              onChange={setNewCity}
              value={newCity}
              enabled={!isSaving}
            />
          </div>
        </>
      )}
    </EditModal>
  );
};

export default PersonalInfoModal;
