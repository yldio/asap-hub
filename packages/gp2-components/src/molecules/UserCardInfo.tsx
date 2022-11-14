import { crossQuery, Link, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps, Fragment } from 'react';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import projectIcon from '../icons/project-icon';
import roleIcon from '../icons/role-icon';
import workingGroupIcon from '../icons/working-group-icon';
import colors from '../templates/colors';
import IconWithLabel from './IconWithLabel';
import UserRegion from './UserRegion';

const { rem } = pixels;

type UserCardInfoProps = Pick<ComponentProps<typeof UserRegion>, 'region'> &
  Pick<gp2Model.UserResponse, 'workingGroups' | 'projects' | 'role'>;

const containerStyles = css({
  marginBottom: rem(12),
});

const dotDivider = css({
  display: 'none',
  [crossQuery]: {
    display: 'unset',
  },
});

const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  [crossQuery]: {
    flexDirection: 'row',
    gap: rem(24),
  },
});

const listLabelStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
});

const workingGroupsStyles = css({
  flexWrap: 'wrap',
  [crossQuery]: {
    gap: '0.25rem',
    flexDirection: 'row',
  },
});

const workingGroupsLinkStyles = css({
  [crossQuery]: {
    width: 'fit-content',
    whiteSpace: 'nowrap',
  },
});

const subduedText = css({ color: colors.neutral800.rgba });

const UserCardInfo: React.FC<UserCardInfoProps> = ({
  role,
  region,
  workingGroups,
  projects,
}) => (
  <div css={containerStyles}>
    <div css={rowStyles}>
      <IconWithLabel icon={roleIcon}>{role}</IconWithLabel>
      <UserRegion region={region} />
    </div>
    <div css={rowStyles}>
      <IconWithLabel icon={workingGroupIcon}>
        <div css={[listLabelStyles, workingGroupsStyles]}>
          {workingGroups?.length ? (
            workingGroups.map(({ id, title }, idx) => (
              <Fragment key={id}>
                {idx === 0 || <span css={dotDivider}>·</span>}
                <Link
                  href={
                    gp2Routing
                      .workingGroups({})
                      .workingGroup({ workingGroupId: id }).$
                  }
                >
                  <span css={workingGroupsLinkStyles}>{title}</span>
                </Link>
              </Fragment>
            ))
          ) : (
            <span css={subduedText}>
              This member isn’t part of any working groups
            </span>
          )}
        </div>
      </IconWithLabel>
    </div>
    <div css={rowStyles}>
      <IconWithLabel icon={projectIcon}>
        <div css={listLabelStyles}>
          {projects?.length ? (
            projects.map(({ id, title }) => (
              <Link
                key={id}
                href={gp2Routing.projects({}).project({ projectId: id }).$}
              >
                {title}
              </Link>
            ))
          ) : (
            <span css={subduedText}>
              This member isn’t part of any projects
            </span>
          )}
        </div>
      </IconWithLabel>
    </div>
  </div>
);

export default UserCardInfo;
