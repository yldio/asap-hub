import { gp2 } from '@asap-hub/model';
import {
  Button,
  Headline5,
  LabeledTextField,
  LabeledTypeahead,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import binIcon from '../icons/bin-icon';

const required = '(required)';

const headerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const buttonStyles = css({ margin: 0 });

type UserPositionProps = {
  index: number;
  onChange: (payload: gp2.UserResponse['positions'][number]) => void;
  isSaving: boolean;
  loadInstitutionOptions: (newValue?: string) => Promise<string[]>;
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
    <article>
      <div css={headerStyles}>
        <Headline5>{prefix} Position</Headline5>
        {index !== 0 && (
          <div css={buttonStyles} data-testid={`delete-${index}`}>
            <Button onClick={onRemove} small>
              {binIcon}
            </Button>
          </div>
        )}
      </div>
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
      />
      <LabeledTextField
        title="Role"
        subtitle={required}
        enabled={!isSaving}
        onChange={onChangeValue('role')}
        value={role}
        required
      />
    </article>
  );
};

export default UserPosition;
