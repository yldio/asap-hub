import {
  createListResearchOutputResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import { fireEvent, render } from '@testing-library/react';
import RelatedResearch from '../RelatedResearch';

it('displays the related research card header and description', () => {
  const { getByText, getByRole, queryByText } = render(
    <RelatedResearch
      relatedResearch={[
        {
          ...createResearchOutputResponse(),
        },
      ]}
    />,
  );
  expect(getByRole('heading', { name: 'Related Research' })).toBeVisible();
  expect(
    getByText(
      'Find out all shared research outputs that contributed to this one.',
    ),
  ).toBeVisible();
  expect(queryByText('View More Outputs')).toBeNull();
});

it('displays the related research links and icons', () => {
  const { getByText, getByRole, getAllByText } = render(
    <RelatedResearch
      relatedResearch={[
        {
          ...createResearchOutputResponse(),
          id: 'id-1',
          documentType: 'Article',
          title: 'Genetics',
          type: 'Preprint',
          teams: [{ id: '1', displayName: 'Team 1' }],
        },
      ]}
    />,
  );
  expect(getAllByText('Article').length).toEqual(2);
  expect(getByText('Preprint')).toBeVisible();
  expect(getByRole('link', { name: 'Team 1' })).toHaveAttribute(
    'href',
    '/network/teams/1',
  );
  expect(getByRole('link', { name: 'Genetics' })).toHaveAttribute(
    'href',
    '/shared-research/id-1',
  );
});

it('does not display the team link if there is no team', () => {
  const { getAllByRole } = render(
    <RelatedResearch
      relatedResearch={[
        {
          ...createResearchOutputResponse(),
          id: 'id-1',
          documentType: 'Article',
          title: 'Genetics',
          type: 'Preprint',
          teams: [],
        },
      ]}
    />,
  );

  expect(getAllByRole('link').length).toEqual(1);
});

it('displays the multiple teams label', () => {
  const { getByText } = render(
    <RelatedResearch
      relatedResearch={[
        {
          ...createResearchOutputResponse(),
          teams: [
            { id: '1', displayName: 'Team 1' },
            { id: '2', displayName: 'Team 2' },
          ],
        },
      ]}
    />,
  );
  expect(getByText('Multiple teams')).toBeVisible();
});

it('displays the view more outputs button', () => {
  const relatedResearchList = createListResearchOutputResponse(10).items;
  relatedResearchList.push({
    ...createResearchOutputResponse(),
    id: 'id-11',
    title: 'Last related research output',
  });
  const { queryByText, getByRole } = render(
    <RelatedResearch relatedResearch={relatedResearchList} />,
  );

  expect(getByRole('button', { name: 'View More Outputs' })).toBeVisible();
  expect(queryByText('Last related research output')).toBeNull();

  const button = getByRole('button', { name: 'View More Outputs' });
  fireEvent.click(button);

  expect(getByRole('button', { name: 'View Less Outputs' })).toBeVisible();
  expect(queryByText('Last related research output')).toBeVisible();
});
