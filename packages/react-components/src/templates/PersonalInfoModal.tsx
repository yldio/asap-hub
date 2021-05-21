import { useState } from 'react';
import { UserPatchRequest } from '@asap-hub/model';
import { css } from '@emotion/react';

import { LabeledTextField, LabeledDropdown } from '../molecules';
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
  'firstName' | 'lastName' | 'degree' | 'institution' | 'location' | 'jobTitle'
> & {
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
};

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({
  firstName = '',
  lastName = '',
  degree = '',
  institution = '',
  location = '',
  jobTitle = '',

  onSave = noop,
  backHref,
}) => {
  const [newFirstName, setNewFirstName] = useState<string>(firstName);
  const [newLastName, setNewLastName] = useState<string>(lastName);
  const [newDegree, setNewDegree] = useState<string>(degree);
  const [newInstitution, setNewInstitution] = useState<string>(institution);
  const [newJobTitle, setNewJobTitle] = useState<string>(jobTitle);
  const [newLocation, setNewLocation] = useState<string>(location);

  return (
    <EditModal
      title="Your details"
      dirty={
        newFirstName !== firstName ||
        newLastName !== lastName ||
        newDegree !== degree ||
        newInstitution !== institution ||
        newJobTitle !== jobTitle ||
        newLocation !== location
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
              location: newLocation,
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
            <LabeledDropdown
              title="Degree"
              onChange={setNewDegree}
              options={[
                { label: 'Choose a degree', value: '' },
                { label: 'BA', value: 'BA' },
                { label: 'BSc', value: 'BSc' },
                { label: 'MSc', value: 'MSc' },
                { label: 'PhD', value: 'PhD' },
                { label: 'MD', value: 'MD' },
                { label: 'PhD, MD', value: 'PhD, MD' },
              ]}
              value={newDegree}
              enabled={!isSaving}
            />
          </div>
          <div css={fieldsContainerStyles}>
            <LabeledTextField
              title="Institution"
              maxLength={44}
              onChange={setNewInstitution}
              value={newInstitution}
              enabled={!isSaving}
            />
            <LabeledTextField
              title="Position"
              maxLength={22}
              onChange={setNewJobTitle}
              value={newJobTitle}
              enabled={!isSaving}
            />
            <LabeledTextField
              title="Location"
              onChange={setNewLocation}
              value={newLocation}
              enabled={!isSaving}
            />
          </div>
        </>
      )}
    </EditModal>
  );
};

export default PersonalInfoModal;
