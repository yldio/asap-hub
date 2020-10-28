import React from 'react';
import css from '@emotion/css';

import { Headline3, Button } from '../atoms';
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
  gridTemplateColumns: 'min-content min-content',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  columnGap: '12px',
});

type ModalEditHeaderProps = {
  title: string;
  onSave?: () => void;
  onClose?: () => void;
};

const ModalEditHeader: React.FC<ModalEditHeaderProps> = ({
  title,
  onClose = noop,
  onSave = noop,
}) => (
  <div css={headerStyles}>
    <div css={controlsContainerStyles}>
      <Button onClick={onSave} primary small>
        Save
      </Button>
      <Button small onClick={onClose}>
        {crossIcon}
      </Button>
    </div>
    <Headline3>{title}</Headline3>
  </div>
);

export default ModalEditHeader;
