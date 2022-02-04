import { css } from '@emotion/react';
import { useCallback, useState } from 'react';
import { Button } from '../atoms';
import { contentSidePaddingWithNavigation } from '../layout';
import { perRem } from '../pixels';
import { noop } from '../utils';
import { TeamCreateOutputExtraInformationCard } from './index';

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

const formContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
});

type TeamCreateOutputFormProps = {
  onCreate?: (data: { keywords: string[] }) => void;
};

const TeamCreateOutputForm: React.FC<TeamCreateOutputFormProps> = ({
  onCreate = noop,
}) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const onCreateFilled = useCallback(() => {
    onCreate({ keywords });
  }, [onCreate, keywords]);
  return (
    <div css={formContainerStyles}>
      <TeamCreateOutputExtraInformationCard
        values={keywords}
        onChange={setKeywords}
      />
      <div css={controlsContainerStyles}>
        <Button primary onClick={onCreateFilled}>
          Share
        </Button>
      </div>
    </div>
  );
};

export default TeamCreateOutputForm;
