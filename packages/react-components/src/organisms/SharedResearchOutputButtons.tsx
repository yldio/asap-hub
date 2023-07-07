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
  displayReviewModal: boolean;
  setDisplayReviewModal: (state: boolean) => void;
  statusChangedBy: ResearchOutputResponse['statusChangedBy'];
  duplicateLink: string | undefined;
  published: boolean;
  displayPublishModal: boolean;
  setDisplayPublishModal: (state: boolean) => void;
};

const SharedResearchOutputButtons: React.FC<
  SharedResearchOutputButtonsProps
> = ({
  id,
  displayReviewModal,
  setDisplayReviewModal,
  statusChangedBy,
  duplicateLink,
  published,
  displayPublishModal,
  setDisplayPublishModal,
}) => {
  const {
    canEditResearchOutput,
    canDuplicateResearchOutput,
    canRequestReview,
    canPublishResearchOutput,
  } = useContext(ResearchOutputPermissionsContext);

  return (
    <div css={buttonsContainer}>
      {canEditResearchOutput &&
        (!statusChangedBy || (statusChangedBy && canPublishResearchOutput)) && (
          <div css={leftButtons}>
            <Link
              noMargin
              href={
                sharedResearch({})
                  .researchOutput({ researchOutputId: id })
                  .editResearchOutput({}).$
              }
              buttonStyle
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
      {!published && canRequestReview && !statusChangedBy && (
        <div css={reviewButton}>
          <Button
            noMargin
            small
            primary
            onClick={() => setDisplayReviewModal(!displayReviewModal)}
          >
            {actionIcon} Ready for PM Review
          </Button>
        </div>
      )}
      {!published && statusChangedBy && canPublishResearchOutput && (
        <div css={reviewButton}>
          <Button
            noMargin
            small
            onClick={() => setDisplayReviewModal(!displayReviewModal)}
          >
            Switch to Draft
          </Button>
        </div>
      )}
      {!published && canPublishResearchOutput && (
        <div css={statusChangedBy ? leftButtons : reviewButton}>
          <Button
            noMargin
            primary
            small
            onClick={() => setDisplayPublishModal(!displayPublishModal)}
          >
            Publish
          </Button>
        </div>
      )}
    </div>
  );
};

export default SharedResearchOutputButtons;
