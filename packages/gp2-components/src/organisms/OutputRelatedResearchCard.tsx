import { gp2 as gp2Model } from '@asap-hub/model';
import { ResearchOutputRelatedResearchCard } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

type OutputRelatedResearchProps = ComponentProps<
  typeof ResearchOutputRelatedResearchCard<
    gp2Model.OutputResponse['relatedOutputs']
  >
>;

const OutputRelatedResearchCard: React.FC<OutputRelatedResearchProps> = ({
  ...props
}) => (
  <ResearchOutputRelatedResearchCard<gp2Model.OutputResponse['relatedOutputs']>
    description="List all resources that were important to the creation of this output."
    {...props}
  />
);
export default OutputRelatedResearchCard;
