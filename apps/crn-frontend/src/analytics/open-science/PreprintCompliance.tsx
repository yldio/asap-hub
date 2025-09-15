import { FC } from 'react';
import { OpensciencePerformanceCard } from '@asap-hub/react-components';

interface PreprintComplianceProps {
  tags: string[];
}

const PreprintCompliance: FC<PreprintComplianceProps> = ({ tags: _tags }) => (
  <div>
    <OpensciencePerformanceCard />
  </div>
);

export default PreprintCompliance;
