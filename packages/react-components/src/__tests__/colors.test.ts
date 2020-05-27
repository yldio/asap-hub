import { color } from '../colors';

describe('the color generator', () => {
  it('sets the red, green, and blue values', () => {
    expect(color(1, 2, 3)).toMatchObject({ r: 1, g: 2, b: 3 });
  });

  it('calculates the CSS rgb string', () => {
    expect(color(1, 2, 3).rgb).toMatchInlineSnapshot(`"rgb(1, 2, 3)"`);
  });

  it('calculates the CSS hex string', () => {
    expect(color(1, 2, 3).hex).toMatchInlineSnapshot(`"#010203"`);
    expect(color(255, 255, 255).hex).toMatchInlineSnapshot(`"#ffffff"`);
  });
});
