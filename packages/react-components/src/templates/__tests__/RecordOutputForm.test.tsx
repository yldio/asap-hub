import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RecordOutputForm from '../RecordOutputForm';

it('renders a form at heading level 2', () => {
  const { getAllByRole } = render(<RecordOutputForm />);
  expect(getAllByRole('heading')).not.toContainEqual(
    expect.objectContaining({ tagName: 'H1' }),
  );
});

const fillOut = async (getByLabelText: RenderResult['getByLabelText']) => {
  await userEvent.type(getByLabelText(/URL/), 'https://asap.science/', {
    allAtOnce: true,
  });
  await userEvent.type(getByLabelText(/title/i), 'Data', {
    allAtOnce: true,
  });
  await userEvent.type(getByLabelText(/description/i), 'My dataset', {
    allAtOnce: true,
  });
  await userEvent.type(getByLabelText(/author/i), 'Me, Myself, I', {
    allAtOnce: true,
  });
};

it('triggers the preview with the form data', async () => {
  const handlePreview = jest.fn();
  const { getByText, getByLabelText } = render(
    <RecordOutputForm onPreview={handlePreview} />,
  );

  await fillOut(getByLabelText);
  userEvent.click(getByText(/preview$/i, { selector: 'button > *' }));
  expect(handlePreview).toHaveBeenCalledWith(
    expect.objectContaining({
      url: 'https://asap.science/',
    }),
  );
});
it('does not trigger the preview when invalid', async () => {
  const handlePreview = jest.fn();
  const { getByText } = render(<RecordOutputForm onPreview={handlePreview} />);

  userEvent.click(getByText(/preview$/i, { selector: 'button > *' }));
  expect(handlePreview).not.toHaveBeenCalled();
});
it('triggers the publish with the form data', async () => {
  const handlePublish = jest.fn();
  const { getByText, getByLabelText } = render(
    <RecordOutputForm onPublish={handlePublish} />,
  );

  await fillOut(getByLabelText);
  userEvent.click(getByText(/publish/i, { selector: 'button > *' }));
  expect(handlePublish).toHaveBeenCalledWith(
    expect.objectContaining({
      url: 'https://asap.science/',
    }),
  );
});
it('does not trigger the publish when invalid', async () => {
  const handlePublish = jest.fn();
  const { getByText } = render(<RecordOutputForm onPublish={handlePublish} />);

  userEvent.click(getByText(/publish/i, { selector: 'button > *' }));
  expect(handlePublish).not.toHaveBeenCalled();
});

it('parses comma-separated authors', async () => {
  const handlePreview = jest.fn();
  const { getByText, getByLabelText } = render(
    <RecordOutputForm onPreview={handlePreview} />,
  );

  await fillOut(getByLabelText);
  userEvent.click(getByText(/preview$/i, { selector: 'button > *' }));
  expect(handlePreview).toHaveBeenCalledWith(
    expect.objectContaining({
      authors: ['Me', 'Myself', 'I'],
    }),
  );
});
