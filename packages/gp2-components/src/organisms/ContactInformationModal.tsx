import { gp2 } from '@asap-hub/model';
import {
  LabeledDropdown,
  LabeledTextField,
  pixels,
} from '@asap-hub/react-components';
import {
  emailExpression,
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
  'email' | 'alternativeEmail' | 'telephone'
> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
    countryCodeSuggestions: { name: string; dialCode: string }[];
  };

const ContactInformationModal: React.FC<ContactInformationModalProps> = ({
  onSave,
  backHref,
  email,
  alternativeEmail,
  telephone,
  countryCodeSuggestions,
}) => {
  const [newAlternativeEmail, setNewAlternativeEmail] = useState(
    alternativeEmail || '',
  );
  const [newCountryCode, setNewCountryCode] = useState(
    telephone?.countryCode || '',
  );
  const [newNumber, setNewNumber] = useState(telephone?.number || '');

  const checkDirty = () =>
    newAlternativeEmail !== (alternativeEmail || '') ||
    newCountryCode !== (telephone?.countryCode || '') ||
    newNumber !== (telephone?.number || '');

  return (
    <EditUserModal
      title="Contact Information"
      description="Provide alternative contact details."
      onSave={() =>
        onSave({
          alternativeEmail: newAlternativeEmail || undefined,
          telephone: {
            countryCode: newCountryCode || undefined,
            number: newNumber || undefined,
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
            value={newAlternativeEmail}
            onChange={setNewAlternativeEmail}
            type={'email'}
            pattern={emailExpression}
            getValidationMessage={() => 'Please enter a valid email address'}
          />
          <div css={telephoneContainerStyles}>
            <div css={css({ flex: `0 0 ${rem(208)}` })}>
              <LabeledDropdown
                title="Country Code"
                subtitle={optional}
                enabled={!isSaving}
                value={newCountryCode}
                description=" "
                onChange={setNewCountryCode}
                options={countryCodeSuggestions.map(({ name, dialCode }) => ({
                  label: `${name} (${dialCode})`,
                  value: dialCode,
                }))}
              />
            </div>

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
