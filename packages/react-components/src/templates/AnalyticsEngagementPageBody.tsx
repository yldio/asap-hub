import { EngagementResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';
import { Headline3, Paragraph } from '../atoms';
import { EngagementTable } from '../organisms';
import { rem } from '../pixels';

const tableHeaderStyles = css({
  paddingBottom: rem(24),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

export type AnalyticsEngagementPageBodyProps = ComponentProps<
  typeof PageControls
> & {
  data: EngagementResponse[];
};
const AnalyticsEngagementPageBody: React.FC<
  AnalyticsEngagementPageBodyProps
> = ({ data, ...pageControlsProps }) => (
  <article>
    <div css={tableHeaderStyles}>
      <Headline3>Representation of Presenters</Headline3>
      <Paragraph>
        Number of presentations conducted by each team, along with an overview
        of which type of presenters were represented.
      </Paragraph>
    </div>
    <EngagementTable data={data} />
    <section css={pageControlsStyles}>
      <PageControls {...pageControlsProps} />
    </section>
  </article>
);

export default AnalyticsEngagementPageBody;
