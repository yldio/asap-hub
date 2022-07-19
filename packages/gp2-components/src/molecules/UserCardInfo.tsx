import { crossQuery, Link, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import projectIcon from '../icons/project-icon';
import roleIcon from '../icons/role-icon';
import workingGroupIcon from '../icons/working-group-icon';
import IconWithLabel from './IconWithLabel';
import UserRegion from './UserRegion';

const { rem } = pixels;

type UserCardInfoProps = Pick<ComponentProps<typeof UserRegion>, 'region'> & {
  workingGroups: { id: string; name: string }[];
  projects: { id: string; name: string }[];
  role: string;
};
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

const UserCardInfo: React.FC<UserCardInfoProps> = ({
  role,
  region,
  workingGroups,
  projects,
}) => {
  return (
    <div css={containerStyles}>
      <div css={rowStyles}>
        <IconWithLabel icon={roleIcon}>{role}</IconWithLabel>
        <UserRegion region={region}></UserRegion>
      </div>
      <div css={rowStyles}>
        <IconWithLabel icon={workingGroupIcon}>
          <div
            css={css({
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              gap: rem(8),
              [crossQuery]: {
                gap: '0.25rem',
                flexDirection: 'row',
              },
            })}
          >
            {workingGroups?.length ? (
              workingGroups.map(({ id, name }, idx) => {
                return (
                  <>
                    {idx !== 0 ? <span css={dotDivider}>·</span> : null}
                    <Link href={'/' + id}>
                      <span
                        css={css({
                          [crossQuery]: {
                            width: 'fit-content',
                            whiteSpace: 'nowrap',
                          },
                        })}
                      >
                        {name}
                      </span>
                    </Link>
                  </>
                );
              })
            ) : (
              <span css={css({ color: 'rgba(146, 153, 158, 1)' })}>
                This member isn’t part of any working groups
              </span>
            )}
          </div>
        </IconWithLabel>
      </div>
      <div css={rowStyles}>
        <IconWithLabel icon={projectIcon}>
          <div
            css={css({ display: 'flex', flexDirection: 'column', gap: rem(8) })}
          >
            {projects?.length ? (
              projects.map(({ id, name }) => {
                return <Link href={'/' + id}>{name}</Link>;
              })
            ) : (
              <span css={css({ color: 'rgba(146, 153, 158, 1)' })}>
                This member isn’t part of any projects
              </span>
            )}
          </div>
        </IconWithLabel>
      </div>
    </div>
  );
};

export default UserCardInfo;
