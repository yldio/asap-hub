import { TabNav, TabLink } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

import { select, number } from './knobs';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Molecules / Navigation / Tab Nav',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => {
  const path = `/${select(
    'Active Tab',
    { Overview: 'overview', Details: 'details' },
    'overview',
  )}`;
  const additionalTabs = number('Number of tabs', 2, { min: 2 }) - 2;
  return (
    <StaticRouter key={path} location={path}>
      <p style={{ textAlign: 'center' }}>
        Dashed border illustrates component dimensions
      </p>
      <div style={{ margin: '60px', border: 'dashed lightgrey' }}>
        <TabNav>
          <TabLink href="/overview">Overview</TabLink>
          <TabLink href="/details">Details</TabLink>
          {Array(additionalTabs)
            .fill(null)
            .map((_, i) => (
              <TabLink key={i} href="/404">
                Additional Tab {i + 1}
              </TabLink>
            ))}
        </TabNav>
      </div>
    </StaticRouter>
  );
};
