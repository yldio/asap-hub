import React, { useEffect, useState } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import Toast from './Toast';
import { rem } from '../pixels';

export type ResearchOutputBanner = 'published' | 'draftCreated';

export type ResearchOutputBannerLocationState = {
  banner?: ResearchOutputBanner;
};

export interface SharedResearchOutputBannersProps {
  association: string;
  documentType: string;
  published: boolean;
  statusChangedBy: ResearchOutputResponse['statusChangedBy'];
  banner?: ResearchOutputBanner;
  reviewToggled: boolean;
  associationName: string;
  isInReview: boolean;
}

const toastContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
});

const SharedResearchOutputBanners: React.FC<
  SharedResearchOutputBannersProps
> = ({
  association,
  documentType,
  published,
  banner,
  statusChangedBy,
  reviewToggled,
  associationName,
  isInReview,
}) => {
  const [flashBanner, setFlashBanner] = useState(banner);
  const [reviewBannerState, setReviewBannerState] = useState(
    reviewToggled ? (isInReview ? 'requested' : 'dismissed') : null,
  );

  useEffect(() => {
    setReviewBannerState(
      reviewToggled ? (isInReview ? 'requested' : 'dismissed') : null,
    );
    setFlashBanner(banner);
  }, [reviewToggled, isInReview, banner]);

  return (
    <div css={toastContainer}>
      {flashBanner === 'draftCreated' && (
        <Toast accent="successLarge" onClose={() => setFlashBanner(undefined)}>
          {`Draft ${
            association === 'working group' ? 'Working Group' : 'Team'
          } ${documentType} created successfully.`}
        </Toast>
      )}
      {reviewBannerState === 'requested' && (
        <Toast accent="successLarge" onClose={() => setReviewBannerState(null)}>
          {`Draft ${association} ${documentType} submitted for PM review successfully.`}
        </Toast>
      )}
      {reviewBannerState === 'dismissed' && (
        <Toast accent="successLarge" onClose={() => setReviewBannerState(null)}>
          {`In review ${association} ${documentType} switched to draft successfully.`}
        </Toast>
      )}
      {!published && isInReview && statusChangedBy && (
        <Toast accent="info">
          {`${statusChangedBy.firstName} ${statusChangedBy.lastName} on ${associationName} requested PMs to review this output. This draft is only available to members in the ${association} listed below.`}
        </Toast>
      )}
      {flashBanner === 'published' && (
        <Toast accent="successLarge" onClose={() => setFlashBanner(undefined)}>
          {`${
            association === 'working group' ? 'Working Group' : 'Team'
          } ${documentType} published successfully.`}
        </Toast>
      )}
      {!published && !isInReview && (
        <Toast accent="warning">{`This draft is available to members in the ${association}
                listed below. Only PMs can publish this output.`}</Toast>
      )}
    </div>
  );
};

export default SharedResearchOutputBanners;
