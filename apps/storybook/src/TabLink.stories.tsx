import { StaticRouter } from 'react-router';
import { TabLink } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Atoms / Navigation / Tab Link',
};

export const Active = () => (
  <StaticRouter location="/target">
    <TabLink href="/target">{text('Text', 'Overview')}</TabLink>
  </StaticRouter>
);
export const Inactive = () => (
  <StaticRouter location="/other">
    <TabLink href="/target">{text('Text', 'Overview')}</TabLink>
  </StaticRouter>
);
