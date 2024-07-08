import { analytics } from '@asap-hub/routing';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import Engagement from '../Engagement';

const renderPage = async (path: string) => {
  const result = render(
    <MemoryRouter initialEntries={[path]}>
      <Route path="/analytics/engagement/">
        <Engagement />
      </Route>
    </MemoryRouter>,
  );

  return result;
};

describe('Engagement', () => {
  it('renders', async () => {
    await renderPage(analytics({}).engagement({}).$);
    expect(screen.getAllByText('Representation of Presenters').length).toBe(1);
  });
});
