import { css } from '@emotion/react';
import React from 'react';
import { Button } from '../atoms';
import { mobileScreen, rem } from '../pixels';

const formControlsContainerStyles = css({
  display: 'flex',
  justifyContent: 'end',
  paddingBottom: rem(200), // Hack for labs selector
  [`@media (max-width: 810px)`]: {
    justifySelf: 'end',
    width: '100%',
  },
});

const formControlsTwoButtonsStyles = css({
  display: 'grid',
  alignItems: 'end',
  gridGap: rem(24),
  gridTemplateColumns: '1fr 1fr',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    gridTemplateColumns: '1fr',
    width: '100%',
    'button:nth-of-type(1)': {
      order: 2,
      margin: '0',
    },
    'button:nth-of-type(2)': {
      order: 1,
      margin: '0',
    },
  },
});

const formControlsThreeButtonsStyles = css({
  display: 'grid',
  alignItems: 'end',
  gap: rem(24),
  gridTemplateColumns: '1fr 1fr 1fr',
  [`@media (max-width: 1110px)`]: {
    gridTemplateColumns: '1fr',
    width: '100%',
    'button:nth-of-type(1)': {
      order: 3,
      margin: '0',
    },
    'button:nth-of-type(2)': {
      order: 2,
      margin: '0',
    },
    'button:nth-of-type(3)': {
      order: 1,
      margin: '0',
    },
  },
});

type ResearchOutputFormActionsProps = {
  savingAction: 'draft' | 'publish' | null;
  isSaving: boolean;
  published: boolean;
  showSaveDraftButton: boolean;
  showPublishButton: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

const ResearchOutputFormActions: React.FC<ResearchOutputFormActionsProps> = ({
  savingAction,
  isSaving,
  published,
  showSaveDraftButton,
  showPublishButton,
  onCancel,
  onSaveDraft,
  onPublish,
}) => {
  const displayThreeButtons = showSaveDraftButton && showPublishButton;

  return (
    <div css={formControlsContainerStyles}>
      <div
        css={
          displayThreeButtons
            ? formControlsThreeButtonsStyles
            : formControlsTwoButtonsStyles
        }
      >
        <Button enabled={!isSaving} fullWidth onClick={onCancel} noMargin>
          Cancel
        </Button>
        {showSaveDraftButton && (
          <Button
            enabled={!isSaving}
            loading={isSaving && savingAction === 'draft'}
            fullWidth
            onClick={onSaveDraft}
            primary={showSaveDraftButton && !showPublishButton}
            noMargin
          >
            Save Draft
          </Button>
        )}
        {showPublishButton && (
          <Button
            enabled={!isSaving}
            loading={isSaving && savingAction === 'publish'}
            fullWidth
            primary
            noMargin
            onClick={onPublish}
          >
            {published ? 'Save' : 'Publish'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResearchOutputFormActions;
