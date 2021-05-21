import { StaticRouter } from 'react-router-dom';
import { TabLink } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

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
