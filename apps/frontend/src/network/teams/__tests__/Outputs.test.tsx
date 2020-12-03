import React from 'react';
import { StaticRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import Outputs from '../Outputs';

it('generates a link to the output', async () => {
  const { getByText } = render(
    <StaticRouter>
      <Outputs
        outputs={[
          { ...createResearchOutputResponse(), id: 'ro0', title: 'Some RO' },
        ]}
      />
    </StaticRouter>,
  );
  expect(getByText(/Some RO/).closest('a')!.href).toMatch(/ro0$/);
});

it('generates a link back to the team', async () => {
  const { getByText } = render(
    <StaticRouter location="/team/outputs">
      <Route path="/team/outputs">
        <Outputs
          outputs={[
            {
              ...createResearchOutputResponse(),
              team: { id: '0', displayName: 'Some Team' },
            },
          ]}
        />
      </Route>
    </StaticRouter>,
  );
  expect(getByText(/Some Team/).closest('a')).toHaveAttribute('href', '/team');
});
