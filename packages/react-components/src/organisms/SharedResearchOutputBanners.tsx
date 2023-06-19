import React, { useEffect, useState } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import Toast from './Toast';

export interface SharedResearchOutputBannersProps {
  association: string;
  documentType: string;
  published: boolean;
  reviewRequestedBy: ResearchOutputResponse['reviewRequestedBy'];
  publishedNow: boolean;
  draftCreated?: boolean;
  reviewToggled: boolean;
  associationName: string;
}

const SharedResearchOutputBanners: React.FC<
  SharedResearchOutputBannersProps
> = ({
  association,
  documentType,
  published,
  publishedNow,
  reviewRequestedBy,
  draftCreated,
  reviewToggled,
  associationName,
}) => {
  const [publishedNowBanner, setPublishedNowBanner] = useState(published);
  const [draftCreatedBanner, setDraftCreatedBanner] = useState(draftCreated);
  const [reviewBannerState, setReviewBannerState] = useState(
    reviewToggled ? (reviewRequestedBy ? 'requested' : 'dismissed') : null,
  );

  useEffect(() => {
    setReviewBannerState(
      reviewToggled ? (reviewRequestedBy ? 'requested' : 'dismissed') : null,
    );
  }, [reviewToggled, reviewRequestedBy]);

  return (
    <>
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

      {reviewRequestedBy && !published && (
        <Toast accent="info">
          {`${reviewRequestedBy.firstName} ${reviewRequestedBy.lastName} on ${associationName} requested PMs to review this output. This draft is only available to members in the ${association} listed below.`}
        </Toast>
      )}
      {(publishedNow || !published) && (
        <div>
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
          {!published && !reviewRequestedBy && (
            <Toast accent="warning">{`This draft is available to members in the ${association}
                listed below. Only PMs can publish this output.`}</Toast>
          )}
        </div>
      )}
    </>
  );
};

export default SharedResearchOutputBanners;
