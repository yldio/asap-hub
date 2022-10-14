import { WorkingGroupResponse } from '@asap-hub/model/src/gp2';
import { Card, Headline3, pixels } from '@asap-hub/react-components';

import { css } from '@emotion/react';

type WorkingGroupResourcesProps = Pick<
  WorkingGroupResponse,
  'members' | 'description' | 'primaryEmail' | 'secondaryEmail'
>;

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `${rem(32)} 0 ${rem(48)}`,
});

const WorkingGroupResources: React.FC<WorkingGroupResourcesProps> = () => (
  <div css={containerStyles}>
    <Card>
      Please note, this is a private space for this working group on the
      network. Nobody outside of this working group can see anything that you
      upload here.
    </Card>
    <Card>
      <Headline3 noMargin>Resource List</Headline3>
      View and share resources that others may find helpful.
    </Card>
  </div>
);

export default WorkingGroupResources;
