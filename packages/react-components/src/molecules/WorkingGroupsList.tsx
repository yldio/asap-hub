import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';

import { perRem, tabletScreen } from '../pixels';
import { Link, Divider } from '../atoms';
import { Fragment } from 'react';

const containerStyles = css({
  display: 'grid',

  gridColumnGap: `${12 / perRem}em`,

  margin: 0,
  marginTop: `${24 / perRem}em`,

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

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridAutoFlow: 'column',
    gridTemplateColumns: '1fr 1fr',

    '&:not(:first-of-type)': {
      gridTemplateRows: '1fr',
    },

    [`&:not(:first-of-type) > :nth-child(odd)`]: {
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
    network({}).workingGroups({}).workingGroup({ workingGroupId: id }).$;

  return (
    <ul css={[containerStyles]}>
      {groups.map(({ name, role, id }, idx) => (
        <Fragment key={`wg-${idx}`}>
          {idx === 0 || <Divider />}
          <li key={idx} css={listItemStyle}>
            <div css={[titleStyle]}>Working Group</div>
            <Link href={wgHref(id)}>{name}</Link>
            <div css={[titleStyle]}>Role</div>
            <div>{role}</div>
          </li>
        </Fragment>
      ))}
    </ul>
  );
};

export default WorkingGroupsList;
