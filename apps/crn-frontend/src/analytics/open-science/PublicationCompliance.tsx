import { FC } from 'react';
import { PublicationComplianceTable } from '@asap-hub/react-components';

interface PublicationComplianceProps {
  tags: string[];
}

const PublicationCompliance: FC<PublicationComplianceProps> = ({
  tags: _tags,
}) => (
  <div>
    <PublicationComplianceTable />
  </div>
);

export default PublicationCompliance;
