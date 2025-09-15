import { FC } from 'react';
import { Paragraph } from '@asap-hub/react-components';

interface PublicationComplianceProps {
  tags: string[];
}

const PublicationCompliance: FC<PublicationComplianceProps> = ({ tags }) => {
  return (
    <div>
      <Paragraph>
        Publication Compliance metrics will be displayed here.
      </Paragraph>
      <Paragraph>Tags: {tags.join(', ') || 'None'}</Paragraph>
    </div>
  );
};

export default PublicationCompliance;
