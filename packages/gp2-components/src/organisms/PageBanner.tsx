import {
  accents,
  drawerQuery,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';

const { mobileScreen, rem, tabletScreen, vminLinearCalcClamped } = pixels;

type imageAndPosition = {
  image: string;
  backgroundPosition: string;
};

type PageBannerProp = {
  imageAndPosition: imageAndPosition;
  title: string;
  description: string;
};

const headerMaxWidth = 748;
const smallerScreenMaxMargin = 72;

const headerStyles = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const cardStyles = css({
  position: 'relative',
  width: '100vw',
  borderWidth: 0,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  [drawerQuery]: {
    left: `calc(max(100vw - ${
      headerMaxWidth + smallerScreenMaxMargin * 2
    }px, 0px) / 2)`,
  },
});

const textContainerStyles = css({
  maxWidth: rem(headerMaxWidth),
  margin: `${rem(48)} auto ${rem(32)}`,
  [drawerQuery]: {
    margin: `${rem(32)} ${vminLinearCalcClamped(
      mobileScreen,
      24,
      tabletScreen,
      72,
      'px',
    )}`,
  },
});

const imageBannerStyles = ({ image, backgroundPosition }: imageAndPosition) => {
  return css({
    width: '100%',
    maxWidth: rem(headerMaxWidth),
    height: rem(72),
    [drawerQuery]: {
      height: rem(48),
    },
    backgroundImage: `url(${image})`,
    borderRadius: `8px 8px 0px 0px`,
    backgroundSize: '100%',
    backgroundPosition: backgroundPosition,
  });
};

const PageBanner: React.FC<PageBannerProp> = ({
  imageAndPosition,
  title,
  description,
}) => {
  return (
    <header css={headerStyles}>
      <div css={imageBannerStyles(imageAndPosition)}></div>
      <div css={[cardStyles, accents.default]}>
        <div css={textContainerStyles}>
          <h1
            css={css({
              fontSize: '39px',
              lineHeight: '48px',
            })}
          >
            {title}
          </h1>
          <Paragraph accent="lead">{description}</Paragraph>
        </div>
      </div>
    </header>
  );
};
export default PageBanner;
