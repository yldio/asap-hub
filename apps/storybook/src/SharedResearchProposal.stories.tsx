import React, { ComponentProps } from 'react';
import {
  SharedResearchOutput,
  SharedResearchProposal,
} from '@asap-hub/react-components';
import { text, date, array } from '@storybook/addon-knobs';

import { createResearchOutputResponse } from '@asap-hub/fixtures';

export default {
  title: 'Templates / Shared Research / Details',
};

const props = (): ComponentProps<typeof SharedResearchOutput> => ({
  ...createResearchOutputResponse(),
  publishDate: new Date(
    date('Published Date', new Date(2020, 6, 12, 14, 32)),
  ).toISOString(),
  description: text(
    'Description',
    'Neural control of muscle function is fundamental to animal behavior. In many cases, specific muscles can generate multiple distinct behaviors. Nonetheless, individual muscle cells are generally regarded as the smallest units of motor control. Here we report that muscle cells can alter their behavioral output by contracting subcellularly.',
  ),
  title: text(
    'Title',
    'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain',
  ),
  link: text('link', 'http://example.com'),
  tags: array('Tags', ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5']),
  lastModifiedDate: new Date(
    date('Last Modified Date', new Date(2020, 6, 12, 14, 32)),
  ).toISOString(),
  backHref: '#',
});

export const Normal = () => (
  <SharedResearchOutput {...props()} type="Proposal" />
);
export const Proposal = () => (
  <SharedResearchProposal {...props()} type="Proposal" />
);
