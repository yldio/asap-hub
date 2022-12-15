import { gp2 } from '@asap-hub/model';
import { Button } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import UserPosition from './UserPosition';
import { addIcon } from '../icons';
import { mobileQuery } from '../layout';

const buttonStyles = css({
  width: 'fit-content',
  margin: 'auto',
  [mobileQuery]: {
    width: '100%',
  },
});
type UserPositionsProps = {
  onChange: (value: gp2.UserPosition[]) => void;
  isSaving: boolean;
  loadInstitutionOptions: (newValue?: string) => Promise<string[]>;
  positions: gp2.UserResponse['positions'];
};
const UserPositions: React.FC<UserPositionsProps> = ({
  onChange,
  isSaving,
  loadInstitutionOptions,
  positions,
}) => {
  const updatePositions: ComponentProps<typeof UserPosition>['onChange'] = (
    position,
    index,
  ) => {
    onChange(Object.assign([], positions, { [index]: position }));
  };

  const addPosition = () => {
    onChange([...positions, { institution: '', department: '', role: '' }]);
  };
  return (
    <>
      {positions.map((position, index) => (
        <UserPosition
          onChange={updatePositions}
          isSaving={isSaving}
          loadInstitutionOptions={loadInstitutionOptions}
          position={position}
          index={index}
          key={`position-${index}`}
        />
      ))}
      {positions.length < 3 && (
        <div css={buttonStyles}>
          <Button onClick={addPosition} enabled={!isSaving}>
            Add More {addIcon}
          </Button>
        </div>
      )}
    </>
  );
};

export default UserPositions;
