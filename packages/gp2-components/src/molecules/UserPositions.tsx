import { Button, pixels, FormSection } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import UserPosition from './UserPosition';
import { addIcon } from '../icons';
import { mobileQuery } from '../layout';

const { rem } = pixels;

const buttonStyles = css({
  width: 'fit-content',
  margin: 'auto',
  [mobileQuery]: {
    width: '100%',
  },
  marginTop: rem(32),
});
const positionsContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(18),
});

type Positions = ComponentProps<typeof UserPosition>['position'][];
type UserPositionsProps = Pick<
  ComponentProps<typeof UserPosition>,
  'isSaving' | 'loadInstitutionOptions'
> & {
  onChange: (value: Positions) => void;
  positions: Positions;
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
    <div>
      <FormSection
        title="Positions"
        description="Share your institutional positions (up to three)"
      >
        {positions.map((position, index) => (
          <div css={positionsContainer} key={`position-${index}`}>
            <UserPosition
              onRemove={remove(index)}
              onChange={update(index)}
              isSaving={isSaving}
              loadInstitutionOptions={loadInstitutionOptions}
              position={position}
              index={index}
            />
          </div>
        ))}
      </FormSection>
      {positions.length < 3 && (
        <div css={buttonStyles}>
          <Button onClick={add} enabled={!isSaving} fullWidth small>
            <span
              css={{
                display: 'inline-flex',
                gap: rem(8),
                margin: `0 ${rem(3)}`,
              }}
            >
              Add Another Position {addIcon}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPositions;
