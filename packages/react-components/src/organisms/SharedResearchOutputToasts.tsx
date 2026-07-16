import React, { useEffect, useState } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import Toast from './Toast';
import { rem } from '../pixels';

export type ResearchOutputToast = 'published' | 'draftCreated';

export type ResearchOutputToastLocationState = {
  toast?: ResearchOutputToast;
};

export interface SharedResearchOutputToastsProps {
  association: string;
  documentType: string;
  published: boolean;
  statusChangedBy: ResearchOutputResponse['statusChangedBy'];
  toast?: ResearchOutputToast;
  reviewToggled: boolean;
  associationName: string;
  isInReview: boolean;
}

const toastContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
});

const SharedResearchOutputToasts: React.FC<SharedResearchOutputToastsProps> = ({
  association,
  documentType,
  published,
  toast,
  statusChangedBy,
  reviewToggled,
  associationName,
  isInReview,
}) => {
  const [flashToast, setFlashToast] = useState(toast);
  const [reviewToastState, setReviewToastState] = useState(
    reviewToggled ? (isInReview ? 'requested' : 'dismissed') : null,
  );

  useEffect(() => {
    setReviewToastState(
      reviewToggled ? (isInReview ? 'requested' : 'dismissed') : null,
    );
    setFlashToast(toast);
  }, [reviewToggled, isInReview, toast]);

  return (
    <div css={toastContainer}>
      {flashToast === 'draftCreated' && (
        <Toast accent="successLarge" onClose={() => setFlashToast(undefined)}>
          {`Draft ${
            association === 'working group' ? 'Working Group' : 'Team'
          } ${documentType} created successfully.`}
        </Toast>
      )}
      {reviewToastState === 'requested' && (
        <Toast accent="successLarge" onClose={() => setReviewToastState(null)}>
          {`Draft ${association} ${documentType} submitted for PM review successfully.`}
        </Toast>
      )}
      {reviewToastState === 'dismissed' && (
        <Toast accent="successLarge" onClose={() => setReviewToastState(null)}>
          {`In review ${association} ${documentType} switched to draft successfully.`}
        </Toast>
      )}
      {!published && isInReview && statusChangedBy && (
        <Toast accent="info">
          {`${statusChangedBy.firstName} ${statusChangedBy.lastName} on ${associationName} requested PMs to review this output. This draft is only available to members in the ${association} listed below.`}
        </Toast>
      )}
      {flashToast === 'published' && (
        <Toast accent="successLarge" onClose={() => setFlashToast(undefined)}>
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

export default SharedResearchOutputToasts;
