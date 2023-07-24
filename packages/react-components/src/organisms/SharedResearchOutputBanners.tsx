import React, { useEffect, useState } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import Toast from './Toast';
import { rem } from '../pixels';

export interface SharedResearchOutputBannersProps {
  association: string;
  documentType: string;
  published: boolean;
  statusChangedBy: ResearchOutputResponse['statusChangedBy'];
  publishedNow: boolean;
  draftCreated?: boolean;
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
  publishedNow,
  statusChangedBy,
  draftCreated,
  reviewToggled,
  associationName,
  isInReview,
}) => {
  const [publishedNowBanner, setPublishedNowBanner] = useState(publishedNow);
  const [draftCreatedBanner, setDraftCreatedBanner] = useState(draftCreated);
  const [reviewBannerState, setReviewBannerState] = useState(
    reviewToggled ? (isInReview ? 'requested' : 'dismissed') : null,
  );

  useEffect(() => {
    setReviewBannerState(
      reviewToggled ? (isInReview ? 'requested' : 'dismissed') : null,
    );
    setPublishedNowBanner(publishedNow);
  }, [reviewToggled, isInReview, publishedNow]);

  return (
    <div css={toastContainer}>
      {draftCreatedBanner && (
        <Toast
          accent="successLarge"
          onClose={() => setDraftCreatedBanner(false)}
        >
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
      {publishedNowBanner && (
        <Toast
          accent="successLarge"
          onClose={() => setPublishedNowBanner(false)}
        >
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
