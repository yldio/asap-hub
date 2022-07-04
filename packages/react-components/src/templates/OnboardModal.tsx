import { css } from '@emotion/react';
import { UserPatchRequest } from '@asap-hub/model';
import { useState } from 'react';

import { Modal } from '../molecules';
import { noop } from '../utils';
import { mobileScreen, perRem } from '../pixels';
import { crossIcon } from '../icons';
import { Button, Headline3, Link, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { Toast } from '../organisms';
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

type OnboardModalProps = {
  readonly backHref: string;
  readonly onSave?: (data: UserPatchRequest) => void | Promise<void>;
};
const OnboardModal: React.FC<OnboardModalProps> = ({
  backHref,
  onSave = noop,
}) => {
  const [status, setStatus] = useState<
    'initial' | 'isSaving' | 'hasError' | 'hasSaved'
  >('initial');
  const historyPush = usePushFromHere();

  return (
    <Modal padding={false}>
      {status === 'hasError' && (
        <Toast>
          There was an error and we were unable to publish your profile
        </Toast>
      )}
      <form>
        <header css={headerStyles}>
          <div css={controlsContainerStyles}>
            <Link small buttonStyle href={backHref}>
              {crossIcon}
            </Link>
          </div>
          <Headline3>Ready to publish your profile?</Headline3>
        </header>
        <div css={[paddingStyles, { paddingTop: 0 }]}>
          <Paragraph accent="lead">
            In order to show you the Hub, we will need to make your profile
            public to the Hub network. Would you like to continue?
          </Paragraph>
          <div css={buttonContainerStyles}>
            <div css={backStyles}>
              <Link
                buttonStyle
                enabled={status !== 'isSaving'}
                small
                href={backHref}
              >
                Back to Editing
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
                    await onSave({ onboarded: true });
                    setStatus('hasSaved');
                    historyPush('/');
                  } catch (e) {
                    setStatus('hasError');
                  }
                }}
              >
                Publish and Explore
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default OnboardModal;
