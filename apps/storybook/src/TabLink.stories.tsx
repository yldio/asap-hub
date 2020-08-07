import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { createLocation } from 'history';
import { TabLink } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Navigation / Tab Link',
};

export const Active = () => (
  <StaticRouter location={createLocation('/target')}>
    <TabLink href="/target">{text('Text', 'Overview')}</TabLink>
  </StaticRouter>
);
export const Inactive = () => (
  <StaticRouter location={createLocation('/other')}>
    <TabLink href="/target">{text('Text', 'Overview')}</TabLink>
  </StaticRouter>
);
