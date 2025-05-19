import { render } from '@testing-library/react';
import FormCard from '../FormCard';

it('renders the children', () => {
  const { container } = render(<FormCard title="Title">Text</FormCard>);
  expect(container).toHaveTextContent('Text');
});

it('renders the title', () => {
  const { container } = render(<FormCard title="Title">Text</FormCard>);
  expect(container).toHaveTextContent('Title');
});

it('renders the description when it is a react node', () => {
  const { container } = render(
    <FormCard title="Title" description={<span>description</span>}>
      Text
    </FormCard>,
  );
  expect(container).toHaveTextContent('description');
});