import { bannerBand, bannerSvg } from '../banner';

const canvas = { width: 1920, height: 1080 };

describe('bannerBand', () => {
  it('sits across the lower third', () => {
    expect(bannerBand('lowerThird', 'bottom', canvas)).toEqual({
      x: 0,
      y: 799,
      width: 1920,
      height: 281,
    });
  });

  it('sits across the upper third', () => {
    expect(bannerBand('lowerThird', 'top', canvas)).toEqual({
      x: 0,
      y: 0,
      width: 1920,
      height: 281,
    });
  });

  it('scales with the canvas', () => {
    expect(bannerBand('lowerThird', 'top', { width: 1280, height: 720 })).toEqual(
      { x: 0, y: 0, width: 1280, height: 187 },
    );
  });
});

describe('bannerSvg', () => {
  it('renders a lower third with a heading and a subtitle', () => {
    expect(
      bannerSvg({
        preset: 'lowerThird',
        text: 'Rebecca Nunn',
        subtitle: 'Project manager, ASAP',
        position: 'bottom',
        canvas,
      }),
    ).toMatchSnapshot();
  });

  it('renders a heading on its own at the top', () => {
    expect(
      bannerSvg({
        preset: 'lowerThird',
        text: 'Rebecca Nunn',
        position: 'top',
        canvas,
      }),
    ).toMatchSnapshot();
  });

  it('is transparent apart from the scrim, so it can be overlaid', () => {
    const svg = bannerSvg({
      preset: 'lowerThird',
      text: 'Rebecca Nunn',
      position: 'bottom',
      canvas,
    });

    expect(svg.match(/<rect/g)).toHaveLength(1);
    expect(svg).toContain('fill-opacity="0.55"');
  });

  it('is left aligned with generous padding', () => {
    expect(
      bannerSvg({
        preset: 'lowerThird',
        text: 'Rebecca Nunn',
        position: 'bottom',
        canvas,
      }),
    ).toContain('x="115"');
  });

  it('wraps and truncates a long heading', () => {
    const svg = bannerSvg({
      preset: 'lowerThird',
      text: 'A banner heading that runs far past the width of the frame and keeps going',
      subtitle: 'a subtitle that also runs far past the width of the frame',
      position: 'bottom',
      canvas,
    });

    expect(svg.match(/<text/g)).toHaveLength(3);
    expect(svg).toMatchSnapshot();
  });

  it('escapes the text', () => {
    expect(
      bannerSvg({
        preset: 'lowerThird',
        text: `Q&A: "the hub"`,
        position: 'bottom',
        canvas,
      }),
    ).toContain('Q&amp;A: &quot;the hub&quot;');
  });
});
