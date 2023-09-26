import { createListTutorialsResponse } from '@asap-hub/fixtures';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RelatedTutorialsCard from '../RelatedTutorialsCard';

it('renders the related tutorials card with no tutorials message', () => {
  render(<RelatedTutorialsCard relatedTutorials={[]} />);
  expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(
    /Tutorials/i,
  );
  expect(screen.getByText(/No related/i)).toBeInTheDocument();
});

it('truncates the related tutorials card', () => {
  const { rerender } = render(
    <RelatedTutorialsCard
      relatedTutorials={createListTutorialsResponse(5).items.map(
        (tutorial, i) => ({
          ...tutorial,
          title: `Example ${i}`,
        }),
      )}
    />,
  );
  expect(screen.getAllByText(/Example/i)).toHaveLength(5);
  rerender(
    <RelatedTutorialsCard
      relatedTutorials={createListTutorialsResponse(5).items.map(
        (tutorial, i) => ({
          ...tutorial,
          title: `Example ${i}`,
        }),
      )}
      truncateFrom={3}
    />,
  );
  expect(screen.getAllByText(/Example/i)).toHaveLength(3);
});

it('can show hidden tutorials', () => {
  render(
    <RelatedTutorialsCard
      relatedTutorials={createListTutorialsResponse(5).items.map(
        (tutorial, i) => ({
          ...tutorial,
          title: `Example ${i}`,
        }),
      )}
      truncateFrom={3}
    />,
  );
  expect(screen.getAllByText(/Example/i)).toHaveLength(3);
  userEvent.click(screen.getByRole('button', { name: /View More Tutorials/i }));
  expect(screen.getAllByText(/Example/i)).toHaveLength(5);
  userEvent.click(screen.getByRole('button', { name: /View Less Tutorials/i }));
  expect(screen.getAllByText(/Example/i)).toHaveLength(3);
});
