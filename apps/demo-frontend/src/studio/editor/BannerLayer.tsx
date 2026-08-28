/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Banner } from '@asap-hub/demo-timeline';
import { FC } from 'react';

const layerStyles = css({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
});

const bandStyles = css({
  position: 'absolute',
  left: 0,
  right: 0,
  padding: '4% 6%',
  background:
    'linear-gradient(to top, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.45) 60%, rgba(0, 0, 0, 0))',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4em',
});

const bottomStyles = css({ bottom: 0 });

const topStyles = css({
  top: 0,
  background:
    'linear-gradient(to bottom, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.45) 60%, rgba(0, 0, 0, 0))',
});

const headingStyles = css({
  margin: 0,
  fontSize: 'clamp(18px, 4.2cqw, 52px)',
  fontWeight: 700,
  lineHeight: 1.1,
});

const subtitleStyles = css({
  margin: 0,
  fontSize: 'clamp(12px, 2.4cqw, 30px)',
  fontWeight: 500,
  opacity: 0.92,
});

// the render fades a banner in and out over 300ms; the preview does the same so
// scrubbing across an edge looks like the finished video
const fadeMs = 300;

const opacityAt = (banner: Banner, tMs: number): number => {
  const since = tMs - banner.startMs;
  const until = banner.startMs + banner.durationMs - tMs;
  if (since < 0 || until < 0) {
    return 0;
  }
  return Math.min(1, since / fadeMs, until / fadeMs);
};

const offsetAt = (banner: Banner, opacity: number): string =>
  banner.animation === 'slide'
    ? `translateY(${(1 - opacity) * (banner.position === 'top' ? -30 : 30)}%)`
    : 'none';

type Props = {
  readonly banners: Banner[];
  readonly tMs: number;
};

const BannerLayer: FC<Props> = ({ banners, tMs }) => (
  <div css={layerStyles}>
    {banners.map((banner) => {
      const opacity = opacityAt(banner, tMs);
      if (opacity <= 0) {
        return null;
      }
      return (
        <div
          key={banner.id}
          css={[
            bandStyles,
            banner.position === 'top' ? topStyles : bottomStyles,
          ]}
          style={{ opacity, transform: offsetAt(banner, opacity) }}
        >
          <p css={headingStyles}>{banner.text}</p>
          {banner.subtitle ? (
            <p css={subtitleStyles}>{banner.subtitle}</p>
          ) : null}
        </div>
      );
    })}
  </div>
);

export default BannerLayer;
