import { ResearchOutputAssociations } from '@asap-hub/model';
import { useState } from 'react';
import { Toast } from '../organisms';

type SharedResearchOutputBannerProps = {
  published: boolean;
  isPublishedNow: boolean;
  documentType: string;
  association: ResearchOutputAssociations;
};

const SharedResearchOutputBanner: React.FC<SharedResearchOutputBannerProps> = ({
  published,
  isPublishedNow,
  documentType,
  association,
}) => {
  const [showPublishedNowToast, setShowPublishedNowToast] =
    useState(isPublishedNow);
  return (
    <div>
      {showPublishedNowToast && published && (
        <Toast
          accent="successLarge"
          onClose={() => setShowPublishedNowToast(false)}
        >
          {`${
            association === 'working group' ? 'Working Group' : 'Team '
          } ${documentType} published successfully.`}
        </Toast>
      )}
      {!published && (
        <Toast accent="warning">{`This draft is available to members in the ${association}
     listed below. Only PMs can publish this output.`}</Toast>
      )}
    </div>
  );
};

export default SharedResearchOutputBanner;
