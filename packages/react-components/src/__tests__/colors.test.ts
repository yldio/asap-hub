import { color } from '../colors';

describe('the color generator', () => {
  describe('for an opaque color', () => {
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

  describe('for a transparent color', () => {
    it('sets the red, green, blue, and alpha values', () => {
      expect(color(1, 2, 3, 0.5)).toMatchObject({ r: 1, g: 2, b: 3, a: 0.5 });
    });

    it('calculates the CSS rgba string', () => {
      expect(color(1, 2, 3, 0.5).rgba).toMatchInlineSnapshot(
        `"rgba(1, 2, 3, 0.5)"`,
      );
    });
  });
});
