import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { mobileScreen, rem } from '../pixels';
import { Link, Button } from '../atoms';
import { editIcon, duplicateIcon, actionIcon } from '../icons';
import { steel } from '../colors';

const commonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
};

const commonMediaQueries = {
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    ...commonStyles,
    width: 'auto',
  },
};

const buttonsContainer = css({
  ...commonStyles,
  flexFlow: 'column',
  gap: rem(16),
  paddingBottom: rem(32),
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexFlow: 'row',
    width: '100%',
  },
});

const leftButtons = css({
  ...commonStyles,
  ...commonMediaQueries,
});

const reviewButton = css({
  ...commonStyles,
  strokeWidth: 0,
  ...{
    ...commonMediaQueries,
    marginLeft: 'auto',
  },
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: rem(12),
    paddingTop: rem(28),
    borderTop: `1px solid ${steel.rgb}`,
  },
});

type SharedResearchOutputButtonsProps = {
  id: string;
  displayModal: boolean;
  setDisplayModal: (state: boolean) => void;
  reviewRequestedBy: ResearchOutputResponse['reviewRequestedBy'];
  duplicateLink: string | undefined;
  published: boolean;
};

const SharedResearchOutputButtons: React.FC<
  SharedResearchOutputButtonsProps
> = ({
  id,
  displayModal,
  setDisplayModal,
  reviewRequestedBy,
  duplicateLink,
  published,
}) => {
  const {
    canEditResearchOutput,
    canDuplicateResearchOutput,
    canRequestReview,
    canPublishResearchOutput,
  } = useContext(ResearchOutputPermissionsContext);

  return (
    <div css={buttonsContainer}>
      {canEditResearchOutput && (
        <div css={leftButtons}>
          <Link
            noMargin
            href={
              sharedResearch({})
                .researchOutput({ researchOutputId: id })
                .editResearchOutput({}).$
            }
            buttonStyle
            enabled={
              !reviewRequestedBy ||
              (reviewRequestedBy && canPublishResearchOutput)
            }
            small
            primary
          >
            {editIcon} Edit
          </Link>
        </div>
      )}
      {canDuplicateResearchOutput && duplicateLink && (
        <div css={leftButtons}>
          <Link noMargin href={duplicateLink} buttonStyle small primary>
            {duplicateIcon} Duplicate
          </Link>
        </div>
      )}
      {/* !canRequestReview in order to see the button as PM */}
      {!published && canRequestReview && !reviewRequestedBy && (
        <div css={reviewButton}>
          <Button
            noMargin
            small
            primary
            onClick={() => setDisplayModal(!displayModal)}
          >
            {actionIcon} Ready for PM Review
          </Button>
        </div>
      )}
      {!published && reviewRequestedBy && canPublishResearchOutput && (
        <div css={reviewButton}>
          <Button noMargin small onClick={() => setDisplayModal(!displayModal)}>
            Switch to Draft
          </Button>
        </div>
      )}
    </div>
  );
};

export default SharedResearchOutputButtons;
