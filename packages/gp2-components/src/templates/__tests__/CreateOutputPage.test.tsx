import { render, screen } from '@testing-library/react';
import { CreateOutputPage } from '..';
import { EntityMappper } from '../CreateOutputPage';

describe('CreateOutputPage', () => {
  it.each(['workingGroup' as const, 'project' as const])(
    'renders the right title for entity %s',
    (entityType) => {
      render(
        <CreateOutputPage entityType={entityType} documentType={'Article'} />,
      );
      expect(screen.getByRole('heading').textContent).toEqual(
        expect.stringContaining(EntityMappper[entityType]),
      );
    },
  );
  it.each([
    'Article' as const,
    'Code/Software' as const,
    'Data Release' as const,
    'Form' as const,
    'Training Materials' as const,
    'Update' as const,
  ])('renders the right title for document type %s', (documentType) => {
    render(
      <CreateOutputPage
        entityType={'workingGroup'}
        documentType={documentType}
      />,
    );
    expect(screen.getByRole('heading').textContent).toEqual(
      expect.stringContaining(documentType.toLowerCase()),
    );
  });
});
