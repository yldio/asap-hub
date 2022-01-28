import { css } from '@emotion/react';
import { Button } from '../atoms';
import { contentSidePaddingWithNavigation } from '../layout';
import { perRem } from '../pixels';
import { noop } from '../utils';

const controlsContainerStyles = css({
  display: 'grid',
  gridAutoFlow: 'column',
  alignItems: 'end',
  justifyContent: 'end',
  columnGap: `${12 / perRem}em`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

type TeamCreateOutputFormProps = {
  onCreate?: () => void;
};

const TeamCreateOutputForm: React.FC<TeamCreateOutputFormProps> = ({
  onCreate = noop,
}) => (
  <div css={controlsContainerStyles}>
    <Button primary onClick={onCreate}>
      Share
    </Button>
  </div>
);

export default TeamCreateOutputForm;
