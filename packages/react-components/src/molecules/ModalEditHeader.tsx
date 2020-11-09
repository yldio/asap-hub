import React from 'react';
import css from '@emotion/css';

import { Headline3, Button, Link } from '../atoms';
import { crossIcon } from '../icons';
import { tabletScreen } from '../pixels';
import { noop } from '../utils';

const headerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
});

const controlsContainerStyles = css({
  display: 'grid',
  gridAutoFlow: 'column',
  alignItems: 'end',
  justifyContent: 'end',
  columnGap: '12px',
});

type ModalEditHeaderProps = {
  title: string;
  backHref: string;
  onSave?: () => void;
};

const ModalEditHeader: React.FC<ModalEditHeaderProps> = ({
  title,
  backHref,
  onSave = noop,
}) => (
  <div css={headerStyles}>
    <div css={controlsContainerStyles}>
      <Button onClick={onSave} primary small submit>
        Save
      </Button>
      <Link small buttonStyle href={backHref}>
        {crossIcon}
      </Link>
    </div>
    <Headline3>{title}</Headline3>
  </div>
);

export default ModalEditHeader;
