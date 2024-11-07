import { css } from '@emotion/react';
import { useHistory } from 'react-router-dom';
import { Button, crossIcon, Headline3, Link, Modal, Paragraph } from '..';
import { mailToSupport } from '../mail';
import { mobileScreen, rem } from '../pixels';

type modal = 'submit' | 'cancel' | null;

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

type ManuscriptFormModalsProps = {
  modal: modal;
  setModal: (modal: modal) => void;
  handleSubmit: () => void;
};

const ManuscriptFormModals: React.FC<ManuscriptFormModalsProps> = ({
  modal,
  setModal,
  handleSubmit,
}) => {
  const history = useHistory();
  const clearModal = () => setModal(null);

  const handleSubmitConfirmationConfirm = () => {
    handleSubmit();
    clearModal();
  };

  const handleCancelManuscriptSubmission = () => {
    clearModal();
    history.goBack();
  };

  return modal ? (
    <Modal>
      {modal === 'submit' && (
        <>
          <header css={headerStyles}>
            <div css={controlsContainerStyles}>
              <Button small onClick={clearModal}>
                {crossIcon}
              </Button>
            </div>
            <Headline3>Submit manuscript?</Headline3>
          </header>

          <Paragraph>
            Only the title, description, and contributor fields are editable
            upon submission. If you need to edit a field that is not editable,
            please <Link href={mailToSupport()}>contact tech support</Link>.
            Once a compliance report has been shared, teams can submit updated
            versions of the manuscript for review.
          </Paragraph>
          <div css={buttonContainerStyles}>
            <div css={backStyles}>
              <Button onClick={clearModal}>Keep Editing</Button>
            </div>
            <div css={confirmStyles}>
              <Button primary onClick={handleSubmitConfirmationConfirm}>
                Submit Manuscript
              </Button>
            </div>
          </div>
        </>
      )}
      {modal === 'cancel' && (
        <>
          <header css={headerStyles}>
            <div css={controlsContainerStyles}>
              <Button small onClick={clearModal}>
                {crossIcon}
              </Button>
            </div>
            <Headline3>Cancel manuscript submission?</Headline3>
          </header>

          <Paragraph>
            Cancelling now will result in the loss of all entered data and will
            exit you from the submission process.
          </Paragraph>
          <div css={buttonContainerStyles}>
            <div css={backStyles}>
              <Button onClick={clearModal}>Keep Editing</Button>
            </div>
            <div css={confirmStyles}>
              <Button warning onClick={handleCancelManuscriptSubmission}>
                Cancel Manuscript Submission
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  ) : (
    <></>
  );
};
export default ManuscriptFormModals;
