import { WorkingGroupResponse } from '@asap-hub/model/build/gp2';
import { Anchor, Card, crossQuery, pixels } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';

const { rem, tabletScreen } = pixels;
const { workingGroups } = gp2;

const avatarSize = 132;

type WorkingGroupCardProps = Pick<
  WorkingGroupResponse,
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
              <div>{members.length} members</div>
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
