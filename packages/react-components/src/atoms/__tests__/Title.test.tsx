import { render } from '@testing-library/react';

import Title from '../Title';
import { ember } from '../../colors';

describe('for titles of type text', () => {
  it('renders the title as a <span>', () => {
    const { getByText } = render(<Title type="text">text</Title>);
    expect(getByText('text').tagName).toBe('SPAN');
  });

  it('applies the text margin', () => {
    const { getByText } = render(<Title type="text">text</Title>);
    const { marginTop } = getComputedStyle(getByText('text'));
    expect(marginTop).toMatchInlineSnapshot(`"12px"`);
  });

  it('renders a given accent color', () => {
    const { getByText } = render(
      <Title type="text" accent="ember">
        text
      </Title>,
    );
    const { color } = getComputedStyle(getByText('text'));
    expect(color).toBe(ember.rgb);
  });
});

describe('for titles of type link', () => {
  it('renders the title as an <a>', () => {
    const { getByText } = render(
      <Title type="link" href="http://testing.io">
        text
      </Title>,
    );
    expect(getByText('text').tagName).toBe('A');
  });

  it('applies the text margin', () => {
    const { getByText } = render(
      <Title type="link" href="http://testing.io">
        text
      </Title>,
    );
    const { marginTop } = getComputedStyle(getByText('text'));
    expect(marginTop).toMatchInlineSnapshot(`"12px"`);
  });

  it('renders a given accent color', () => {
    const { getByText } = render(
      <Title type="link" href="http://testing.io" accent="ember">
        text
      </Title>,
    );
    const { color } = getComputedStyle(getByText('text'));
    expect(color).toBe(ember.rgb);
  });

  it('target is _self', () => {
    const { getByText } = render(
      <Title type="link" href="http://testing.io" accent="ember">
        text
      </Title>,
    );
    expect(getByText('text')).toHaveAttribute('target', '_self');
  });

  describe('when openInNewTab is true', () => {
    it('target is _blank', () => {
      const { getByText } = render(
        <Title openInNewTab type="link" href="http://testing.io" accent="ember">
          text
        </Title>,
      );
      expect(getByText('text')).toHaveAttribute('target', '_blank');
    });
  });
});
