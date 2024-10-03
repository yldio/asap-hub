import {
  PerformanceMetricByDocumentType,
  UserProductivityPerformance,
} from '@asap-hub/model';
import { CaptionItem } from '../molecules';
import CaptionCard from './CaptionCard';

type PerformanceCardProps = {
  performance: PerformanceMetricByDocumentType | UserProductivityPerformance;
  type: 'by-document' | 'by-output';
};

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  performance,
  type,
}) => {
  if (type === 'by-document') {
    const data = performance as PerformanceMetricByDocumentType;
    return (
      <CaptionCard>
        <>
          <CaptionItem label="Articles" {...data.article} />
          <CaptionItem label="Lab Materials" {...data.labMaterial} />
          <CaptionItem label="Bioinformatics" {...data.bioinformatics} />
          <CaptionItem label="Protocols" {...data.protocol} />
          <CaptionItem label="Datasets" {...data.dataset} />
        </>
      </CaptionCard>
    );
  }
  const data = performance as UserProductivityPerformance;
  return (
    <CaptionCard>
      <>
        <CaptionItem label="ASAP Output" {...data.asapOutput} />
        <CaptionItem label="ASAP Public Output" {...data.asapPublicOutput} />
        <CaptionItem label="Ratio" {...data.ratio} />
      </>
    </CaptionCard>
  );
};
export default PerformanceCard;
