import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Anchor,
  Card,
  crossQuery,
  pixels,
  utils,
} from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import teamIcon from '../icons/team-icon';

const { rem, tabletScreen, perRem } = pixels;
const { workingGroups } = gp2;
const { getCounterString } = utils;
const avatarSize = 132;

type WorkingGroupCardProps = Pick<
  gp2Model.WorkingGroupResponse,
  'id' | 'title' | 'members' | 'shortDescription' | 'leadingMembers'
>;
const containerStyles = css({
  display: 'grid',
  columnGap: rem(32),
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: `${rem(avatarSize)} auto`,
  },
});

const textContainerStyles = css({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'start',
  flexDirection: 'column',
});
const titleStyles = css({
  margin: `8px 0`,
  fontWeight: 'bold',
  fontSize: '26px',
  lineHeight: '32px',
});
const detailContainerStyles = css({
  marginBottom: rem(12),
});
const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  [crossQuery]: {
    flexDirection: 'row',
    gap: rem(24),
  },
});
const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${15 / perRem}em`,
});

const WorkingGroupCard: React.FC<WorkingGroupCardProps> = ({
  id,
  title,
  members,
  shortDescription,
  leadingMembers,
}) => {
  const workingGroupHref = workingGroups({}).workingGroup({
    workingGroupId: id,
  }).$;
  return (
    <Card>
      <div css={containerStyles}>
        <div css={textContainerStyles}>
          <div>
            <Anchor href={workingGroupHref}>
              <h3 css={titleStyles}>{title}</h3>
            </Anchor>
          </div>
          <div css={detailContainerStyles}>
            <div css={rowStyles}>
              <div>
                <span css={iconStyles}>{teamIcon} </span>
                <span>{getCounterString(members.length, 'member')}</span>
              </div>
            </div>
            <div css={rowStyles}>
              <div>{shortDescription}</div>
            </div>
            {leadingMembers === undefined || (
              <div css={rowStyles}>
                <div>{leadingMembers}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkingGroupCard;
