import { UserResponse } from '@asap-hub/model';
import { Ellipsis } from '../atoms';
import { getUniqueCommaStringWithSuffix } from '../utils';

type UserProfileLabTextProps = Partial<Pick<UserResponse, 'labs'>>;

const UserProfileLabText: React.FC<UserProfileLabTextProps> = ({
  labs = [],
}) => {
  const labsList = getUniqueCommaStringWithSuffix(
    labs?.map((lab) => lab.name),
    'Lab',
  );
  return <Ellipsis>{labsList}</Ellipsis>;
};

export default UserProfileLabText;
