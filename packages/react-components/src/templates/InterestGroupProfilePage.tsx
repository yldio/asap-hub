import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import InterestGroupProfileHeader from './InterestGroupProfileHeader';
import { networkPageLayoutPaddingStyle } from '../layout';
import { Toast } from '../organisms';

const mainStyles = css({
  padding: networkPageLayoutPaddingStyle,
});

type InterestGroupProfilePageProps = ComponentProps<
  typeof InterestGroupProfileHeader
>;
const InterestGroupProfilePage: React.FC<
  React.PropsWithChildren<InterestGroupProfilePageProps>
> = ({ children, active, ...props }) => (
  <article>
    {!active && (
      <Toast accent="warning">
        This group is inactive and might not have all content available.
      </Toast>
    )}
    <InterestGroupProfileHeader {...props} active={active} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default InterestGroupProfilePage;
