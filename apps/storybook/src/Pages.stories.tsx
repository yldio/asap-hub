import React from 'react';
import { PagesSection } from '@asap-hub/react-components';
import { createPageResponse } from '@asap-hub/fixtures';
import { number, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Sections / Pages',
};

export const Normal = () => (
  <PagesSection
    title={text('Title', 'Where to Start')}
    pages={Array.from(
      { length: number('Number of Pages', 2, { min: 0 }) },
      (_, idx) => createPageResponse(String(idx)),
    )}
  />
);
