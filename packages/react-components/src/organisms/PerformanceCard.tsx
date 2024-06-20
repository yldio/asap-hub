import { CaptionItem } from '../molecules';
import { CaptionItemProps } from '../molecules/CaptionItem';
import CaptionCard from './CaptionCard';

type PerformanceCardProps = {
  performance: CaptionItemProps[];
};

const PerformanceCard: React.FC<PerformanceCardProps> = ({ performance }) => {
  return (
    <CaptionCard>
      <>
        {performance.map((item) => (
          <CaptionItem {...item} />
        ))}
      </>
    </CaptionCard>
  );
};
export default PerformanceCard;
