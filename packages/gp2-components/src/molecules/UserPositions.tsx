import { gp2 } from '@asap-hub/model';
import { Button, Headline4, Paragraph } from '@asap-hub/react-components';
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
  const update: (
    index: number,
  ) => ComponentProps<typeof UserPosition>['onChange'] =
    (index: number) => (position) => {
      onChange(Object.assign([], positions, { [index]: position }));
    };

  const add = () => {
    onChange([...positions, { institution: '', department: '', role: '' }]);
  };
  const remove = (index: number) => () => {
    onChange(positions.filter((_, idx) => idx !== index));
  };
  return (
    <>
      <header>
        <Headline4>Positions</Headline4>
        <Paragraph accent="lead">
          Share the positions inside the institutions where you are working (up
          to three).
        </Paragraph>
      </header>
      {positions.map((position, index) => (
        <UserPosition
          onRemove={remove(index)}
          onChange={update(index)}
          isSaving={isSaving}
          loadInstitutionOptions={loadInstitutionOptions}
          position={position}
          index={index}
          key={`position-${index}`}
        />
      ))}
      {positions.length < 3 && (
        <div css={buttonStyles}>
          <Button onClick={add} enabled={!isSaving}>
            Add Another Position {addIcon}
          </Button>
        </div>
      )}
    </>
  );
};

export default UserPositions;
