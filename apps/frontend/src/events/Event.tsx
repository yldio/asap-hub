import React from 'react';
import { useParams } from 'react-router-dom';
import { NotFoundPage } from '@asap-hub/react-components';

import { useEventById } from './state';

const Event: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = useEventById(id);

  if (event) {
    return <>{JSON.stringify(event)}</>;
  }

  return <NotFoundPage />;
};

export default Event;
