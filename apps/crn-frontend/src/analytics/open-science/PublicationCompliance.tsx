import { FC } from 'react';
import { OpensciencePerformanceCard } from '@asap-hub/react-components';

interface PublicationComplianceProps {
  tags: string[];
}

const PublicationCompliance: FC<PublicationComplianceProps> = ({
  tags: _tags,
}) => (
  <div>
    <OpensciencePerformanceCard legend="Percentage is calculated as total research outputs shared across all publications divided by total research outputs identified across all publications." />
  </div>
);

export default PublicationCompliance;
