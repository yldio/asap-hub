import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { join } from 'path';
import {
  RecordOutputPage,
  Paragraph,
  Layout,
} from '@asap-hub/react-components';
import { ResearchOutputFormData } from '@asap-hub/model';

import { useCreateResearchOutput } from '../api';

const CreateResearchOutput: React.FC<{}> = () => {
  const { url } = useRouteMatch();

  const { data, error, post } = useCreateResearchOutput();
  const handlePublish = ({
    doi,
    publishDate,
    authors,
    ...formData
  }: ResearchOutputFormData) => {
    post({
      ...formData,
      doi: doi || undefined,
      publishDate: publishDate?.toISOString(),
      authors: authors.map((author) => ({ displayName: author })),
    });
  };

  return error ? (
    <Layout>
      <Paragraph>
        {error.name}: {error.message}
      </Paragraph>
    </Layout>
  ) : data ? (
    <Redirect push to={join(url, '..', data.id)} />
  ) : (
    <RecordOutputPage onPublish={handlePublish} />
  );
};

export default CreateResearchOutput;
