import React from 'react';

import { DiscoverPage, DiscoverPageBody } from '@asap-hub/react-components';

const Discover: React.FC<{}> = () => {
  const data = {
    pages: [],
    members: [],
    aboutUs: '',
  };

  return (
    <DiscoverPage>
      <DiscoverPageBody {...data} />
    </DiscoverPage>
  );
};

export default Discover;
