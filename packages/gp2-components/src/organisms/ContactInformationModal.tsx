import { gp2, isServerValidationError } from '@asap-hub/model';
import {
  invalidEmailMessage,
  LabeledDropdown,
  LabeledTextField,
  pixels,
  FormSection,
} from '@asap-hub/react-components';
import {
  gp2EmailExpression,
  telephoneNumberExpression,
} from '@asap-hub/validation';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { useNavigate } from 'react-router';
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

// Exported so the caller wiring toServerValidationError uses the same list this
// modal can render. A path it cannot map produces a save that reports nothing.
export const contactInformationServerErrorPaths = ['/alternativeEmail'];

const ContactInformationModal: React.FC<ContactInformationModalProps> = ({
  onSave,
  backHref,
  email,
  alternativeEmail,
  telephone,
  countryCodeSuggestions,
}) => {
  const navigate = useNavigate();
  const [newAlternativeEmail, setNewAlternativeEmail] = useState(
    alternativeEmail || '',
  );
  const [serverError, setServerError] = useState('');
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
      onSave={async () => {
        setServerError('');
        try {
          await onSave({
            alternativeEmail: newAlternativeEmail || null,
            telephone: {
              countryCode: newCountryCode || undefined,
              number: newNumber || undefined,
            },
          });
        } catch (error) {
          if (!isServerValidationError(error)) throw error;

          const rejectsTheEmail = error.validationErrors.some(
            ({ instancePath }) => instancePath === '/alternativeEmail',
          );
          if (!rejectsTheEmail) {
            // Nothing is on screen, and EditModal drops its toast for a
            // ServerValidationError — so downgrade to keep the generic report.
            throw new Error(error.message, { cause: error });
          }

          setServerError(invalidEmailMessage);
          // EditModal treats a resolved promise as a save and navigates away.
          throw error;
        }
        void navigate(backHref);
      }}
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <>
          <FormSection>
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
              onChange={(value) => {
                setNewAlternativeEmail(value);
                // A stale server error keeps the field DOM-invalid through
                // setCustomValidity, and EditModal gates the save on
                // reportValidity(), so it would block the next attempt.
                setServerError('');
              }}
              customValidationMessage={serverError}
              type={'email'}
              // The browser ANDs its own address check with `pattern`, so this
              // adds the content model's rule on top rather than replacing it:
              // test@test passes the browser and fails here.
              pattern={gp2EmailExpression}
              // Defer to the browser's own message ("A part following '@'
              // should not contain the symbol '+'.") and to the server's, both
              // more specific than this one.
              getValidationMessage={({ typeMismatch, customError }) =>
                typeMismatch || customError ? undefined : invalidEmailMessage
              }
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
          </FormSection>
          {/* Give extra space to the options rendered above */}
          <div css={{ paddingBottom: rem(80) }} />
        </>
      )}
    </EditUserModal>
  );
};

export default ContactInformationModal;
