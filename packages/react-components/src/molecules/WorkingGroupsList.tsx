import { Fragment } from 'react';

import { css } from '@emotion/react';
import { networkRoutes } from '@asap-hub/routing';

import { perRem, tabletScreen } from '../pixels';
import { Link, Divider } from '../atoms';

const containerStyles = css({
  display: 'grid',

  gridColumnGap: `${12 / perRem}em`,

  margin: 0,

  padding: 0,
  listStyle: 'none',
});

const titleStyle = css({
  fontWeight: 'bold',
});

const listItemStyle = css({
  display: 'grid',

  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr 1fr',
  gridRowGap: `${12 / perRem}em`,

  '&:not(:last-of-type)': {
    marginBottom: `${8 / perRem}em`,
  },

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridAutoFlow: 'column',
    gridTemplateColumns: '1fr 1fr',

    '&(:first-of-type)': {
      gridTemplateRows: '1fr 2fr',
    },

    '&:not(:first-of-type)': {
      gridTemplateRows: '1fr',
    },

    [`&:not(:first-of-type) > :nth-of-type(odd)`]: {
      display: 'none',
    },
  },
});
interface WorkingGroupsListProps {
  readonly groups: ReadonlyArray<{
    id: string;
    role: string;
    name: string;
  }>;
}

const WorkingGroupsList: React.FC<WorkingGroupsListProps> = ({ groups }) => {
  const wgHref = (id: string) =>
    // TODO: fix this
    networkRoutes.DEFAULT.path;
  // network({}).workingGroups({}).workingGroup({ workingGroupId: id }).$;

  return (
    <ul css={[containerStyles]}>
      {groups.map(({ name, role, id }, idx) => (
        <Fragment key={`wg-${idx}`}>
          {idx === 0 || <Divider />}
          <li key={idx} css={listItemStyle}>
            <div css={[titleStyle]}>Working Group</div>
            <div>
              <Link href={wgHref(id)}>{name}</Link>
            </div>
            <div css={[titleStyle]}>Role</div>
            <div>{role}</div>
          </li>
        </Fragment>
      ))}
    </ul>
  );
};

export default WorkingGroupsList;
