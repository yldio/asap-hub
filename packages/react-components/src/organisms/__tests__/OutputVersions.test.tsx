import { createVersionList, createVersionResponse } from '@asap-hub/fixtures';
import { fireEvent, render } from '@testing-library/react';
import OutputVersions, { OutputVersionsProps } from '../OutputVersions';

const baseProps: OutputVersionsProps = {
  versions: [
    {
      id: '1',
      type: 'Preprint',
      documentType: 'Article',
      title: 'Test',
      link: 'https://test.com',
    },
  ],
};

it('displays the output versions header', () => {
  const { getByRole, queryByText } = render(<OutputVersions {...baseProps} />);
  expect(getByRole('heading', { name: 'Version History' })).toBeVisible();
  expect(queryByText('View More Versions')).toBeNull();
});

it('displays the view more versions button', () => {
  const versionList = createVersionList(10);
  versionList.push({
    ...createVersionResponse(),
    id: 'id-11',
    title: 'Last version',
  });
  const { queryByText, getByRole } = render(
    <OutputVersions versions={versionList} />,
  );

  expect(getByRole('button', { name: 'View More Versions' })).toBeVisible();
  expect(queryByText('Last version')).toBeNull();

  const button = getByRole('button', { name: 'View More Versions' });
  fireEvent.click(button);

  expect(getByRole('button', { name: 'View Less Versions' })).toBeVisible();
  expect(queryByText('Last version')).toBeVisible();
});
