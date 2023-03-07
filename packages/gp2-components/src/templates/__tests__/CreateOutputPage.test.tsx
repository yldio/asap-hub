import { render, screen } from '@testing-library/react';
import { CreateOutputPage } from '..';
import { documentTypeMapper, EntityMappper } from '../CreateOutputPage';

describe('CreateOutputPage', () => {
  it.each(['workingGroup' as const, 'project' as const])(
    'renders the right title for entity %s',
    (entityType) => {
      render(
        <CreateOutputPage entityType={entityType} documentType={'article'} />,
      );
      expect(screen.getByRole('heading').textContent).toEqual(
        expect.stringContaining(EntityMappper[entityType]),
      );
    },
  );
  it.each([
    'article' as const,
    'code-software' as const,
    'data-release' as const,
    'form' as const,
    'training-materials' as const,
    'update' as const,
  ])('renders the right title for document type %s', (documentType) => {
    render(
      <CreateOutputPage
        entityType={'workingGroup'}
        documentType={documentType}
      />,
    );
    expect(screen.getByRole('heading').textContent).toEqual(
      expect.stringContaining(documentTypeMapper[documentType].toLowerCase()),
    );
  });
});
