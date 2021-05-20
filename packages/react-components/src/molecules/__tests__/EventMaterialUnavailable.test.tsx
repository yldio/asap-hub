import { render } from '@testing-library/react';

import EventMaterialUnavailable from '../EventMaterialUnavailable';

it('renders text specific to the material type', () => {
  const { container, rerender } = render(
    <EventMaterialUnavailable materialType="Notes" />,
  );
  expect(container).toHaveTextContent(/are no Notes/);

  rerender(<EventMaterialUnavailable materialType="Presentation" />);
  expect(container).not.toHaveTextContent(/Notes/);
  expect(container).toHaveTextContent(/is no Presentation/);
});
