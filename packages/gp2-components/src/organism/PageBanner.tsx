import { drawerQuery, Paragraph } from '@asap-hub/react-components';
import { accents } from '@asap-hub/react-components/src/atoms/Card';
import {
  mobileScreen,
  tabletScreen,
  vminLinearCalcClamped,
} from '@asap-hub/react-components/src/pixels';
import { css } from '@emotion/react';

type PageBannerProp = {
  image: string;
  title: string;
  description: string;
};

const headerStyles = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const cardStyles = css({
  position: 'relative',
  width: '100vw',
  boxSizing: 'border-box',
  borderWidth: 0,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  [drawerQuery]: {
    left: `calc(max(100vw - 892px, 0px) / 2)`,
  },
});

const PageBanner: React.FC<PageBannerProp> = ({
  image,
  title,
  description,
}) => (
  <header css={headerStyles}>
    <div
      css={css({
        width: '100%',
        maxWidth: '748px',
        height: '72px',
        [drawerQuery]: {
          height: '48px',
        },

        backgroundImage: `url(${image})`,
        borderRadius: `8px 8px 0px 0px`,
        backgroundSize: '100%',
      })}
    ></div>

    <div css={[cardStyles, accents['default']]}>
      <div
        css={css({
          maxWidth: '720px',
          margin: '48px auto 32px',
          [drawerQuery]: {
            margin: `32px ${vminLinearCalcClamped(
              mobileScreen,
              24,
              tabletScreen,
              72,
              'px',
            )}`,
          },
        })}
      >
        <h1
          css={css({
            fontSize: '39px',
            lineHeight: '48px',
          })}
        >
          {title}
        </h1>
        <Paragraph>{description}</Paragraph>
      </div>
    </div>
  </header>
);
export default PageBanner;
