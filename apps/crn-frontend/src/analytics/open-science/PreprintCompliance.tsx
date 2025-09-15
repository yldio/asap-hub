import { FC } from 'react';
import { Paragraph } from '@asap-hub/react-components';

interface PreprintComplianceProps {
  tags: string[];
}

const PreprintCompliance: FC<PreprintComplianceProps> = ({ tags }) => {
  return (
    <div>
      <Paragraph>Preprint Compliance metrics will be displayed here.</Paragraph>
      <Paragraph>Tags: {tags.join(', ') || 'None'}</Paragraph>
    </div>
  );
};

export default PreprintCompliance;
