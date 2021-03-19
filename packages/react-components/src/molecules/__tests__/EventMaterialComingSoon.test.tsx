import { render } from '@testing-library/react';
import React from 'react';

import EventMaterialComingSoon from '../EventMaterialComingSoon';

it('renders text specific to the material type', () => {
  const { container, rerender } = render(
    <EventMaterialComingSoon materialType="Notes" />,
  );
  expect(container).toHaveTextContent(/Notes/);

  rerender(<EventMaterialComingSoon materialType="Presentation" />);
  expect(container).not.toHaveTextContent(/Notes/);
  expect(container).toHaveTextContent(/Presentation/);
});
