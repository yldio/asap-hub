import { css } from '@emotion/react';
import { Button, crossIcon, Headline3, Modal, Paragraph } from '..';
import { mobileScreen, rem } from '../pixels';

const headerStyles = css({
  padding: 0,
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
  columnGap: rem(24),
  gridTemplateRows: 'max-content 12px max-content',
  [buttonMediaQuery]: {
    gridTemplateColumns: 'max-content max-content',
    gridTemplateRows: 'auto',
    justifyContent: 'flex-end',
  },
});

const confirmStyles = css({
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

type EndDiscussionModalProps = {
  handleSubmit: () => void;
  handleCancel: () => void;
};

const EndDiscussionModal: React.FC<EndDiscussionModalProps> = ({
  handleSubmit,
  handleCancel,
}) => {
  const handleEndDiscussion = () => {
    handleSubmit();
  };

  return (
    <Modal>
      <header css={headerStyles}>
        <div css={controlsContainerStyles}>
          <Button small onClick={handleCancel} data-testid="close-button">
            {crossIcon}
          </Button>
        </div>
        <Headline3>End discussion and notify?</Headline3>
      </header>

      <Paragraph>
        By ending the discussion, the correspondent members on teams and labs
        will receive a reminder on the CRN Hub and an email with the latest
        updates.
      </Paragraph>
      <div css={buttonContainerStyles}>
        <div css={backStyles}>
          <Button
            onClick={handleCancel}
            data-testid="cancel-end-discussion-button"
          >
            Cancel
          </Button>
        </div>
        <div css={confirmStyles}>
          <Button
            primary
            onClick={handleEndDiscussion}
            data-testid="submit-end-discussion"
          >
            End Discussion and Notify
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default EndDiscussionModal;
