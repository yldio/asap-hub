import { gp2 } from '@asap-hub/model';
import {
  Button,
  LabeledTextField,
  LabeledTypeahead,
  FormSection,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import binIcon from '../icons/bin-icon';

const required = '(required)';

const buttonStyles = css({ margin: 0 });

type UserPositionProps = {
  index: number;
  onChange: (payload: gp2.UserPosition) => void;
  isSaving: boolean;
  loadInstitutionOptions: NonNullable<
    ComponentProps<typeof LabeledTypeahead>['loadOptions']
  >;
  position: gp2.UserPosition;
  onRemove: () => void;
};

const UserPosition: React.FC<UserPositionProps> = ({
  onChange,
  onRemove,
  isSaving,
  loadInstitutionOptions,
  position,
  index,
}) => {
  const { institution, department, role } = position;
  const onChangeValue = (property: keyof gp2.UserPosition) => (value: string) =>
    onChange({ ...position, [property]: value });

  const prefixes = ['Primary', 'Secondary', 'Tertiary'];
  const prefix = prefixes[index];
  return (
    <>
      <FormSection
        secondaryTitle={`${prefix} Position`}
        headerDecorator={
          index !== 0 ? (
            <div css={buttonStyles}>
              <Button onClick={onRemove} small>
                <span css={css({ display: 'inline-flex' })}>{binIcon}</span>
              </Button>
            </div>
          ) : null
        }
      >
        <LabeledTypeahead
          title="Institution"
          subtitle={required}
          required
          getValidationMessage={() => 'Please add your institution'}
          maxLength={44}
          onChange={onChangeValue('institution')}
          value={institution}
          enabled={!isSaving}
          loadOptions={loadInstitutionOptions}
        />
        <LabeledTextField
          title="Department"
          subtitle={required}
          enabled={!isSaving}
          onChange={onChangeValue('department')}
          value={department}
          required
          getValidationMessage={() => 'Please add your department'}
        />
        <LabeledTextField
          title="Role"
          subtitle={required}
          enabled={!isSaving}
          onChange={onChangeValue('role')}
          value={role}
          required
          getValidationMessage={() => 'Please add your role'}
        />
      </FormSection>
    </>
  );
};

export default UserPosition;
