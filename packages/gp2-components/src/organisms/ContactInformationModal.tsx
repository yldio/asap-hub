import { gp2 } from '@asap-hub/model';
import { LabeledTextField, pixels } from '@asap-hub/react-components';
import {
  emailExpression,
  telephoneCountryExpression,
  telephoneNumberExpression,
} from '@asap-hub/validation';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { mobileQuery } from '../layout';
import { ContactSupport } from '../molecules';
import EditUserModal from './EditUserModal';

const { rem } = pixels;
const telephoneContainerStyles = css({
  [mobileQuery]: {
    display: 'unset',
  },
  display: 'flex',
  gap: rem(24),
});
const optional = '(optional)';

type ContactInformationModalProps = Pick<
  gp2.UserResponse,
  'email' | 'secondaryEmail' | 'telephone'
> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  };

const ContactInformationModal: React.FC<ContactInformationModalProps> = ({
  onSave,
  backHref,
  email,
  secondaryEmail,
  telephone,
}) => {
  const [newSecondaryEmail, setNewSecondaryEmail] = useState(
    secondaryEmail || '',
  );
  const [newCountryCode, setNewCountryCode] = useState(
    telephone?.countryCode || '',
  );
  const [newNumber, setNewNumber] = useState(telephone?.number || '');

  const checkDirty = () =>
    newSecondaryEmail !== (secondaryEmail || '') ||
    newCountryCode !== (telephone?.countryCode || '') ||
    newNumber !== (telephone?.number || '');

  return (
    <EditUserModal
      title="Contact Information"
      description="Provide alternative contact details."
      onSave={() =>
        onSave({
          secondaryEmail: newSecondaryEmail,
          telephone: {
            countryCode: newCountryCode,
            number: newNumber,
          },
        })
      }
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <>
          <LabeledTextField
            title="Institutional Email"
            description={<ContactSupport />}
            required
            enabled={false}
            value={email}
          />
          <LabeledTextField
            title="Alternative Email"
            subtitle={optional}
            description="An alternative way for members to contact you. This will not affect the way that you login."
            enabled={!isSaving}
            value={newSecondaryEmail}
            onChange={setNewSecondaryEmail}
            type={'email'}
            pattern={emailExpression}
            getValidationMessage={() => 'Please enter a valid email address'}
          />
          <div css={telephoneContainerStyles}>
            <LabeledTextField
              title="Country Code"
              subtitle={optional}
              showDescriptionSpace
              enabled={!isSaving}
              value={newCountryCode}
              onChange={setNewCountryCode}
              pattern={telephoneCountryExpression}
              getValidationMessage={() =>
                'Please enter a valid telephone country code'
              }
            />
            <LabeledTextField
              title="Telephone Number"
              subtitle={optional}
              description="Please note: this will only be visible to admins."
              enabled={!isSaving}
              value={newNumber}
              onChange={setNewNumber}
              pattern={telephoneNumberExpression}
              getValidationMessage={() =>
                'Please enter a valid telephone number'
              }
              type={'tel'}
            />
          </div>
        </>
      )}
    </EditUserModal>
  );
};

export default ContactInformationModal;
