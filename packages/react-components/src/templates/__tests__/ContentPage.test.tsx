import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ContentPage from '../ContentPage';

const boilerplateProps = {
  text: '<h1>h1</h1>',
  path: '/',
  title: 'title',
};

it('renders the content and the title', () => {
  const { getByText } = render(
    <MemoryRouter>
      <ContentPage {...boilerplateProps} />
    </MemoryRouter>,
  );

  expect(getByText('title')).toBeVisible();
  expect(getByText('title').tagName).toEqual('H1');
  expect(getByText('h1', { selector: 'h4' })).toBeVisible();
});

it('scrolls to the hash when it is present in the URL', async () => {
  // Create target element with mocked scrollIntoView
  const targetElement = document.createElement('div');
  targetElement.id = 'section';
  targetElement.scrollIntoView = jest.fn();
  document.body.appendChild(targetElement);

  render(
    <MemoryRouter initialEntries={['/page#section']}>
      <ContentPage {...boilerplateProps} />
    </MemoryRouter>,
  );

  await waitFor(
    () => {
      expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    },
    { timeout: 200 },
  );

  document.body.removeChild(targetElement);
});
