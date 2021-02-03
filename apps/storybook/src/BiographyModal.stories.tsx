import React from 'react';
import { BiographyModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / User Profile / Biography Modal',
  component: BiographyModal,
};

export const Normal = () => (
  <StaticRouter>
    <BiographyModal biography="My Bio" backHref="#" />
  </StaticRouter>
);
