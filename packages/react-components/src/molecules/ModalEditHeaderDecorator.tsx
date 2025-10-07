import { css } from '@emotion/react';

import { Button, Link } from '../atoms';
import { crossIcon } from '../icons';
import { rem } from '../pixels';

type ModalEditHeaderDecoratorProps = {
  backHref: string;
  onSave?: () => void | Promise<void>;
  saveEnabled?: boolean;
};

const wrapStyles = css({
  display: 'flex',
  flexFlow: 'row',
  gap: rem(10),
});

const ModalEditHeaderDecorator: React.FC<ModalEditHeaderDecoratorProps> = ({
  backHref,
  onSave,
  saveEnabled = true,
}) => (
  <div css={wrapStyles}>
    {onSave && (
      <Button primary small onClick={onSave} enabled={saveEnabled}>
        Save
      </Button>
    )}
    <Link small buttonStyle href={backHref}>
      {crossIcon}
    </Link>
  </div>
);

export default ModalEditHeaderDecorator;
