import { css } from '@emotion/react';
import { useState } from 'react';

import { Button, Headline3, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { crossIcon } from '../icons';
import { Modal } from '../molecules';
import { mobileScreen, perRem } from '../pixels';

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
    gridTemplateRows: 'auto',
    justifyContent: 'flex-end',
  },
});

const confirmButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '1 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
    gridColumn: '2',
  },
});
const dismissButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '2 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
  },
});

type ShareComplianceReportModalProps = {
  onDismiss: () => void;
  onConfirm: () => Promise<void>;
};

const ShareComplianceReportModal: React.FC<ShareComplianceReportModalProps> = ({
  onDismiss,
  onConfirm,
}) => {
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const handleConfirm = async () => {
    setIsRequestInProgress(true);
    await onConfirm();
    setIsRequestInProgress(false);
    onDismiss();
  };

  return (
    <Modal padding={false}>
      <header css={headerStyles}>
        <div css={controlsContainerStyles}>
          <Button small onClick={onDismiss} enabled={!isRequestInProgress}>
            {crossIcon}
          </Button>
        </div>
        <Headline3>Share compliance report?</Headline3>
      </header>
      <div css={[paddingStyles, { paddingTop: 0 }]}>
        <Paragraph accent="lead">
          If you elect to share the compliance report, all associated team
          members (First Author(s), PM, PIs, Corresponding Author and Additional
          Authors) will receive a reminder on the CRN Hub and an email to notify
          them that this report is now available.{' '}
        </Paragraph>
        <div css={buttonContainerStyles}>
          <div css={dismissButtonStyles}>
            <Button enabled={!isRequestInProgress} onClick={onDismiss}>
              Keep Editing
            </Button>
          </div>
          <div css={confirmButtonStyles}>
            <Button
              primary
              enabled={!isRequestInProgress}
              onClick={handleConfirm}
            >
              Share Compliance Report
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareComplianceReportModal;
