import { css } from '@emotion/react';

import { Headline3, Button, Link } from '../atoms';
import { crossIcon } from '../icons';
import { rem, tabletScreen } from '../pixels';
import { noop } from '../utils';
import { paddingStyles } from '../card';
import { steel } from '../colors';

const headerStyles = css(paddingStyles, {
  paddingBottom: rem(12),
  borderBottom: `1px solid ${steel.rgb}`,

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
  columnGap: rem(12),
});

type ModalEditHeaderProps = {
  title: string;

  backHref: string;

  onSave?: () => void | Promise<void>;
  saveEnabled?: boolean;
};

const ModalEditHeader: React.FC<ModalEditHeaderProps> = ({
  title,
  backHref,
  onSave = noop,
  saveEnabled = true,
}) => (
  <header css={headerStyles}>
    <div css={controlsContainerStyles}>
      <Button primary small onClick={onSave} enabled={saveEnabled}>
        Save
      </Button>
      <Link small buttonStyle href={backHref}>
        {crossIcon}
      </Link>
    </div>
    <Headline3>{title}</Headline3>
  </header>
);

export default ModalEditHeader;
