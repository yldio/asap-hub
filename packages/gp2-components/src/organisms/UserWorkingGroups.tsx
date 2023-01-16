import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { Link, Paragraph, pixels, utils } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { nonMobileQuery } from '../layout';
import colors from '../templates/colors';
import { IconWithLabel } from '../molecules';
import userIcon from '../icons/user-icon';
import usersIcon from '../icons/users-icon';

const { rem } = pixels;
const { getCounterString } = utils;

const contentStyles = css({
  padding: `${rem(16)} 0`,
});

const rowStyles = css({
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: rem(12),
  padding: `${rem(16)} 0 ${rem(12)}`,
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
  [nonMobileQuery]: {
    display: 'flex',
    alignItems: 'center',
  },
});

const listElementStyles = css({
  marginBottom: rem(18),
});

const listElementMainStyles = css({
  [nonMobileQuery]: {
    flex: '40% 0 0',
  },
});
const listElementSecondaryStyles = css({
  [nonMobileQuery]: {
    flex: '30% 0 0',
  },
});

type UserWorkingGroupsProps = Pick<
  gp2.UserResponse,
  'id' | 'firstName' | 'workingGroups'
>;

const UserWorkingGroups: React.FC<UserWorkingGroupsProps> = ({
  workingGroups,
  firstName,
  id,
}) => {
  const getUserWorkingGroupRole = (
    userId: gp2.UserResponse['id'],
    workingGroup: gp2.UserResponse['workingGroups'][number],
  ): gp2.WorkingGroupMemberRole | null =>
    workingGroup.members.find((member) => member.userId === userId)?.role ||
    null;

  return (
    <>
      <div css={[contentStyles]}>
        <Paragraph noMargin accent="lead">
          {firstName} is involved in the following GP2 working groups:
        </Paragraph>
      </div>
      {workingGroups.slice(0, 3).map((workingGroup) => (
        <div key={`user-working-group-${workingGroup.id}`} css={rowStyles}>
          <div css={[listElementStyles, listElementMainStyles]}>
            <Link
              underlined
              href={
                gp2Routing.workingGroups({}).workingGroup({
                  workingGroupId: workingGroup.id,
                }).$
              }
            >
              {workingGroup.title}
            </Link>
          </div>
          <div css={[listElementStyles, listElementSecondaryStyles]}>
            <IconWithLabel icon={userIcon}>
              {getUserWorkingGroupRole(id, workingGroup)}
            </IconWithLabel>
          </div>
          <div css={[listElementStyles, listElementSecondaryStyles]}>
            <IconWithLabel icon={usersIcon}>
              {getCounterString(workingGroup.members.length, 'Member')}
            </IconWithLabel>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserWorkingGroups;
