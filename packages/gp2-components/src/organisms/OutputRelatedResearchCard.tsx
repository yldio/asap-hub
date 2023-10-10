import { ResearchOutputRelatedResearchCard } from '@asap-hub/react-components';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { ComponentProps } from 'react';
import {
  outputArticle,
  outputCode,
  outputDataset,
  outputForm,
  outputMaterial,
  outputReport,
} from '../icons';

type OutputRelatedResearchProps = ComponentProps<
  typeof ResearchOutputRelatedResearchCard
>;

export const getIconForDocumentType = (
  documentType: string,
): EmotionJSX.Element => {
  switch (documentType) {
    case 'Article':
      return outputArticle;
    case 'Code/Software':
      return outputCode;
    case 'Dataset':
      return outputDataset;
    case 'GP2 Reports':
      return outputReport;
    case 'Procedural Form':
      return outputForm;
    case 'Training Materials':
      return outputMaterial;
    default:
      return outputReport;
  }
};

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
