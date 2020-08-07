import React from 'react';
import { TabNav, TabLink } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';
import { createLocation } from 'history';
import { select } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Navigation / Tab Nav',
};

export const Normal = () => {
  const path = `/${select(
    'Active Tab',
    { Overview: 'overview', Details: 'details' },
    'overview',
  )}`;
  return (
    <StaticRouter key={path} location={createLocation(path)}>
      <TabNav>
        <TabLink href="/overview">Overview</TabLink>
        <TabLink href="/details">Details</TabLink>
      </TabNav>
    </StaticRouter>
  );
};
