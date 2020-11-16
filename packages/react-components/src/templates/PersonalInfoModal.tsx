import React, { useRef, useState } from 'react';
import { UserResponse } from '@asap-hub/model';
import css from '@emotion/css';

import ModalEditHeader from '../molecules/ModalEditHeader';
import { LabeledTextField, LabeledDropdown } from '../molecules';
import { noop } from '../utils';
import { perRem, tabletScreen } from '../pixels';
import { Modal } from '../organisms';

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

type ModelData = Pick<
  UserResponse,
  'firstName' | 'lastName' | 'degree' | 'institution' | 'location' | 'jobTitle'
>;

type PersonalInfoModalProps = ModelData & {
  onSave?: (data: ModelData) => Promise<void>;
  backHref: string;
};

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({
  firstName,
  lastName,
  degree,
  institution,
  location,
  jobTitle,

  onSave = noop,
  backHref,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [newFirstName, setNewFirstName] = useState<string>(firstName || '');
  const [newLastName, setNewLastName] = useState<string>(lastName || '');
  const [newDegree, setNewDegree] = useState<string>(degree || '');
  const [newInstitution, setNewInstitution] = useState<string>(
    institution || '',
  );
  const [newJobTitle, setNewJobTitle] = useState<string>(jobTitle || '');
  const [newLocation, setNewLocation] = useState<string>(location || '');
  return (
    <Modal>
      <form ref={formRef}>
        <ModalEditHeader
          backHref={backHref}
          onSave={() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
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
              );
            }
          }}
          title="Your details"
        />
        <div css={[fieldsContainerStyles, paddingStyles]}>
          <LabeledTextField
            title="First name*"
            onChange={setNewFirstName}
            value={newFirstName}
            required
          />
          <LabeledTextField
            title="Last name(s)*"
            onChange={setNewLastName}
            value={newLastName}
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
          />
        </div>
        <div css={fieldsContainerStyles}>
          <LabeledTextField
            title="Institution"
            maxLength={44}
            onChange={setNewInstitution}
            value={newInstitution}
          />
          <LabeledTextField
            title="Position"
            maxLength={22}
            onChange={setNewJobTitle}
            value={newJobTitle}
          />
          <LabeledTextField
            title="Location"
            onChange={setNewLocation}
            value={newLocation}
          />
        </div>
      </form>
    </Modal>
  );
};

export default PersonalInfoModal;
