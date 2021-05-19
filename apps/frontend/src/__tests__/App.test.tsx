import { render } from '@testing-library/react';

import App from '../App';

it('renders a loading indicator', async () => {
  const { container } = render(<App />);
  expect(container).toHaveTextContent(/loading/i);
});
