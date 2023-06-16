import React, { Dispatch, SetStateAction } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import Toast from './Toast';

interface SharedResearchOutputBannersProps {
  draftCreatedBanner: boolean | undefined;
  setDraftCreatedBanner: Dispatch<SetStateAction<boolean | undefined>>;
  reviewRequestedBanner: boolean;
  setReviewRequestedBanner: Dispatch<SetStateAction<boolean>>;
  reviewDismissedBanner: boolean;
  setReviewDismissedBanner: Dispatch<SetStateAction<boolean>>;
  association: string;
  documentType: string;
  publishedNowBanner: boolean;
  setPublishedNowBanner: Dispatch<SetStateAction<boolean>>;
  published: boolean;
  reviewRequestedBy: ResearchOutputResponse['reviewRequestedBy'];
  publishedNow: boolean;
}

const SharedResearchOutputBanners: React.FC<
  SharedResearchOutputBannersProps
> = ({
  draftCreatedBanner,
  setDraftCreatedBanner,
  reviewRequestedBanner,
  setReviewRequestedBanner,
  reviewDismissedBanner,
  setReviewDismissedBanner,
  association,
  documentType,
  publishedNowBanner,
  setPublishedNowBanner,
  published,
  publishedNow,
  reviewRequestedBy,
}) => (
  <>
    {draftCreatedBanner && (
      <Toast accent="successLarge" onClose={() => setDraftCreatedBanner(false)}>
        {`Draft ${
          association === 'working group' ? 'Working Group' : 'Team'
        } ${documentType} created successfully.`}
      </Toast>
    )}
    {reviewRequestedBanner && (
      <Toast
        accent="successLarge"
        onClose={() => setReviewRequestedBanner(false)}
      >
        {`Draft ${association} ${documentType} submitted for PM review successfully.`}
      </Toast>
    )}
    {reviewDismissedBanner && (
      <Toast
        accent="successLarge"
        onClose={() => setReviewDismissedBanner(false)}
      >
        {`In review ${association} ${documentType} switched to draft successfully.`}
      </Toast>
    )}

    {reviewRequestedBy && (
      <Toast accent="info">
        {`${reviewRequestedBy.firstName}  ${reviewRequestedBy.lastName} on AssociationName requested PMs to review this output. This draft is only available to members in the ${association} listed below.`}
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
              association === 'working group' ? 'Working Group' : 'Team '
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

export default SharedResearchOutputBanners;
