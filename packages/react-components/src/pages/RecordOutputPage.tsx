import React from 'react';
import { ResearchOutputFormData } from '@asap-hub/model';

import { RecordOutputForm } from '../templates';
import { Layout } from '../organisms';
import { Display, Paragraph } from '../atoms';
import {
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  contentSidePaddingWithNavigation,
} from '../pixels';

interface RecordOutputPageProps {
  onPreview?: (formData: ResearchOutputFormData) => void;
  onPublish?: (formData: ResearchOutputFormData) => void;
}
const RecordOutputPage: React.FC<RecordOutputPageProps> = ({
  onPreview,
  onPublish,
}) => {
  return (
    <Layout navigation>
      <div
        css={{
          boxSizing: 'border-box',
          width: 'max-content',
          maxWidth: '100%',
          padding: `${vminLinearCalc(
            mobileScreen,
            36,
            largeDesktopScreen,
            72,
            'px',
          )} ${contentSidePaddingWithNavigation()}`,
        }}
      >
        <Display styleAsHeading={2}>Record an output</Display>
        <Paragraph primary accent="lead">
          Tell us about what you've been working on.
        </Paragraph>
        <RecordOutputForm onPreview={onPreview} onPublish={onPublish} />
      </div>
    </Layout>
  );
};

export default RecordOutputPage;
