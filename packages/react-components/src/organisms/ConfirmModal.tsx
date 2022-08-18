import { css } from '@emotion/react';
import { useState } from 'react';

import { Modal } from '../molecules';
import { noop } from '../utils';
import { mobileScreen, perRem } from '../pixels';
import { crossIcon } from '../icons';
import { Button, Headline3, Link, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { Toast } from '.';
import { usePushFromHere } from '../routing';

const headerStyles = css(paddingStyles, {
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
});

const controlsContainerStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
});

const buttonMediaQuery = `@media (min-width: ${mobileScreen.max - 100}px)`;

const buttonContainerStyles = css({
  display: 'grid',
  columnGap: `${30 / perRem}em`,
  gridTemplateRows: 'max-content 12px max-content',
  [buttonMediaQuery]: {
    gridTemplateColumns: 'max-content max-content',
  },
});

const saveStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '1 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
    gridColumn: '2',
  },
});
const backStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '2 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
  },
});

type ConfirmModalProps = {
  readonly error?: string;
  readonly title: string;
  readonly description?: string;
  readonly confirmText?: string;
  readonly cancelText?: string;

  readonly backHref: string;
  readonly successHref?: string;
  readonly onSave?: () => void | Promise<void>;
};
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  error = 'There was an error',
  backHref,
  successHref,
  onSave = noop,
}) => {
  const [status, setStatus] = useState<
    'initial' | 'isSaving' | 'hasError' | 'hasSaved'
  >('initial');
  const historyPush = usePushFromHere();

  return (
    <Modal padding={false}>
      {status === 'hasError' && <Toast>{error}</Toast>}
      <form>
        <header css={headerStyles}>
          <div css={controlsContainerStyles}>
            <Link small buttonStyle href={backHref}>
              {crossIcon}
            </Link>
          </div>
          <Headline3>{title}</Headline3>
        </header>
        <div css={[paddingStyles, { paddingTop: 0 }]}>
          <Paragraph accent="lead">{description}</Paragraph>
          <div css={buttonContainerStyles}>
            <div css={backStyles}>
              <Link
                buttonStyle
                enabled={status !== 'isSaving'}
                small
                href={backHref}
              >
                {cancelText}
              </Link>
            </div>
            <div css={saveStyles}>
              <Button
                primary
                small
                enabled={status !== 'isSaving'}
                onClick={async () => {
                  setStatus('isSaving');
                  try {
                    await onSave();
                    setStatus('hasSaved');
                    historyPush(successHref ?? backHref);
                  } catch (e) {
                    setStatus('hasError');
                  }
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ConfirmModal;
