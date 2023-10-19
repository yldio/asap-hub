import { ResearchOutputRelatedResearchCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

import { getIconForDocumentType } from '../utils';

type OutputRelatedResearchProps = ComponentProps<
  typeof ResearchOutputRelatedResearchCard
>;

const OutputRelatedResearchCard: React.FC<OutputRelatedResearchProps> = ({
  ...props
}) => (
  <ResearchOutputRelatedResearchCard
    description="List all resources that were important to the creation of this output."
    getIconForDocumentType={getIconForDocumentType}
    {...props}
  />
);
export default OutputRelatedResearchCard;
