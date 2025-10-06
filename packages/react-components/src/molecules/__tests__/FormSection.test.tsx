import { render } from '@testing-library/react';
import FormSection from '../FormSection';

it('renders the children', () => {
  const { container } = render(<FormSection title="Title">Text</FormSection>);
  expect(container).toHaveTextContent('Text');
});

it('renders the title', () => {
  const { container } = render(<FormSection title="Title">Text</FormSection>);
  expect(container).toHaveTextContent('Title');
});

it('renders the description when it is a string', () => {
  const { container } = render(
    <FormSection title="Title" description="Test description">
      Text
    </FormSection>,
  );
  expect(container).toHaveTextContent('Test description');
});

it('renders the description when it is a react node', () => {
  const { container } = render(
    <FormSection title="Title" description={<span>description</span>}>
      Text
    </FormSection>,
  );
  expect(container).toHaveTextContent('description');
});

it('renders the header decorator', () => {
  const { container } = render(
    <FormSection title="Title" headerDecorator={<button>Edit</button>}>
      Text
    </FormSection>,
  );
  expect(container).toHaveTextContent('Edit');
});

it('renders without title', () => {
  const { container } = render(<FormSection>Text</FormSection>);
  expect(container).toHaveTextContent('Text');
  expect(container.querySelector('h3')).not.toBeInTheDocument();
});

it('renders with only description', () => {
  const { container } = render(
    <FormSection description="Just description">Text</FormSection>,
  );
  expect(container).toHaveTextContent('Just description');
  expect(container).toHaveTextContent('Text');
});

it('renders with only header decorator', () => {
  const { container } = render(
    <FormSection headerDecorator={<button>Save</button>}>Text</FormSection>,
  );
  expect(container).toHaveTextContent('Save');
  expect(container).toHaveTextContent('Text');
});

it('renders with title and header decorator but without description', () => {
  const { container } = render(
    <FormSection title="Settings" headerDecorator={<button>Edit</button>}>
      Text
    </FormSection>,
  );
  expect(container).toHaveTextContent('Settings');
  expect(container).toHaveTextContent('Edit');
  expect(container).toHaveTextContent('Text');
});

it('renders section with aria-label from title', () => {
  const { container } = render(
    <FormSection title="Account Settings">Text</FormSection>,
  );
  const section = container.querySelector('section');
  expect(section).toHaveAttribute('aria-label', 'Account Settings');
});
