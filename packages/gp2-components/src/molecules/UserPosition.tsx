import { gp2 } from '@asap-hub/model';
import { LabeledTextField, LabeledTypeahead } from '@asap-hub/react-components';
const required = '(required)';

type UserPositionProps = {
  index: number;
  onChange: (
    payload: gp2.UserResponse['positions'][number],
    index: number,
  ) => void;
  isSaving: boolean;
  loadInstitutionOptions: (newValue?: string) => Promise<string[]>;
  position: gp2.UserPosition;
};
const UserPosition: React.FC<UserPositionProps> = ({
  onChange,
  isSaving,
  loadInstitutionOptions,
  position,
  index,
}) => {
  const { institution, department, role } = position;
  const onChangeValue = (property: keyof gp2.UserPosition) => (value: string) =>
    onChange({ ...position, [property]: value }, index);

  const prefix = index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Other';
  return (
    <>
      <LabeledTypeahead
        title={`${prefix} Institution`}
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
        title={`${prefix} Department`}
        subtitle={required}
        enabled={!isSaving}
        onChange={onChangeValue('department')}
        value={department}
        required
      />
      <LabeledTextField
        title={`${prefix} Role`}
        subtitle={required}
        enabled={!isSaving}
        onChange={onChangeValue('role')}
        value={role}
        required
      />
    </>
  );
};

export default UserPosition;
